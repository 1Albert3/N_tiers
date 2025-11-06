<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            // Rate limiting
            $key = 'register:' . $request->ip();
            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'error' => 'Trop de tentatives d\'inscription. Réessayez dans ' . $seconds . ' secondes.'
                ], 429);
            }

            RateLimiter::hit($key, 300); // 5 minutes

            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
                'email_verified_at' => now(), // Auto-verify for demo
            ]);

            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'Inscription réussie',
                'user' => $user->only(['id', 'name', 'email', 'created_at']),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60 // 30 days in seconds
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'email' => $request->input('email'),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Erreur lors de l\'inscription. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            // Rate limiting
            $key = 'login:' . $request->ip();
            if (RateLimiter::tooManyAttempts($key, 10)) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'error' => 'Trop de tentatives de connexion. Réessayez dans ' . $seconds . ' secondes.'
                ], 429);
            }

            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                RateLimiter::hit($key, 300); // 5 minutes penalty
                
                Log::warning('Failed login attempt', [
                    'email' => $request->input('email'),
                    'ip' => $request->ip()
                ]);

                return response()->json([
                    'error' => 'Identifiants invalides'
                ], 401);
            }

            RateLimiter::clear($key); // Clear on successful login

            $user = User::where('email', $request->input('email'))->firstOrFail();
            
            // Revoke old tokens for security
            $user->tokens()->delete();
            
            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'Connexion réussie',
                'user' => $user->only(['id', 'name', 'email', 'created_at']),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60 // 30 days in seconds
            ]);

        } catch (\Exception $e) {
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'email' => $request->input('email'),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Erreur lors de la connexion. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Delete current token
            $request->user()->currentAccessToken()->delete();

            Log::info('User logged out', [
                'user_id' => $user->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);

        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Erreur lors de la déconnexion'
            ], 500);
        }
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Delete current token
            $request->user()->currentAccessToken()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            Log::info('Token refreshed', [
                'user_id' => $user->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 30 * 24 * 60 * 60
            ]);

        } catch (\Exception $e) {
            Log::error('Token refresh failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Erreur lors du renouvellement du token'
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            return response()->json([
                'user' => $user->only(['id', 'name', 'email', 'created_at', 'updated_at'])
            ]);

        } catch (\Exception $e) {
            Log::error('Get user failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'error' => 'Erreur lors de la récupération des informations utilisateur'
            ], 500);
        }
    }
}
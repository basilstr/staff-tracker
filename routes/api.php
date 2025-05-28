<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RankController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SocialiteCallbackController;
use App\Http\Controllers\Api\SocialiteRedirectController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [UserController::class, 'login']);
Route::post('/user/registered/{invite}', [EmployeeController::class, 'registered'])->name('user.registered');
Route::post('/employee/registered/{invite}', [UserController::class, 'registered'])->name('employee.registered');

Route::prefix('user')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('/', [UserController::class, 'update'])->name('user.update');
        Route::delete('/', [UserController::class, 'destroy'])->name('user.destroy');
        Route::get('/invite', [UserController::class, 'invite'])->name('user.invite');
        Route::post('/join', [UserController::class, 'join'])->name('user.join');
    });
});

Route::prefix('statuses')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/{unit}', [StatusController::class, 'index'])->name('statuses.index');
        Route::post('/{unit}', [StatusController::class, 'update'])->name('statuses.update');
    });
});

Route::prefix('ranks')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [RankController::class, 'index'])->name('ranks.index');
    });
});

Route::prefix('units')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [UnitController::class, 'index'])->name('units.index');
        Route::post('/', [UnitController::class, 'update'])->name('units.update');
    });
});

Route::prefix('employees')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/{unit}', [EmployeeController::class, 'index'])->name('employee.index');
        Route::post('/{unit}', [EmployeeController::class, 'store'])->name('employee.store');
    });
});

Route::prefix('employee')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/{employee}', [EmployeeController::class, 'show'])->name('employee.show');
        Route::get('/{employee}/invite', [EmployeeController::class, 'invite'])->name('employee.invite');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('employee.update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('employee.destroy');
    });
});

Route::prefix('schedule')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/unit/{unit}/{from}/{to}', [ScheduleController::class, 'list'])->name('schedule.list');
        Route::post('/group/{unit}/{from}/{to}', [ScheduleController::class, 'group'])->name('schedule.group');
        Route::post('/employee/{employee}/{from}/{to}', [ScheduleController::class, 'employee'])->name('schedule.employee');
    });
});

Route::prefix('report')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/statuses/{unit}/{from}/{to}', [ReportController::class, 'statuses'])->name('report.statuses');
    });
});


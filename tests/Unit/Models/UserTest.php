<?php

use App\Models\Employee;
use App\Models\ScheduleLog;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;

mutates(User::class);

describe('User Model', function () {
    it('can create a user', function () {
        $user = User::factory()->create([
            'name' => 'user',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        expect($user)->toBeInstanceOf(User::class)
            ->and($user->name)->toBe('user')
            ->and($user->email)->toBe('test@example.com')
            ->and(Hash::check('password123', $user->password))->toBeTrue();
    });

    it('has correct hidden attributes', function () {
        $user = User::factory()->create();
        $hiddenAttributes = $user->getHidden();

        expect($hiddenAttributes)->toContain('password')
            ->and($hiddenAttributes)->toContain('remember_token');
    });

    it('has correct fillable attributes', function () {
        $user = User::factory()->create();
        $fillableAttributes = $user->getFillable();

        expect($fillableAttributes)->toContain('name')
            ->and($fillableAttributes)->toContain('email')
            ->and($fillableAttributes)->toContain('password')
            ->and($fillableAttributes)->toContain('name')
            ->and($fillableAttributes)->toContain('invite_user_id')
            ->and($fillableAttributes)->toContain('invite')
            ->and($fillableAttributes)->toContain('expired_at');
    });

    it('has a precisely defined cast configuration', function () {
        $reflectionMethod = new ReflectionMethod(User::class, 'casts');
        $user = new User;
        $casts = $reflectionMethod->invoke($user);

        expect($casts)->toBe([
            'email_verified_at' => 'datetime',
            'expired_at' => 'datetime',
            'password' => 'hashed',
        ]);
    });

    it('invite user', function () {
        $userMaster = User::factory()->create();
        $user = User::factory()->create(['invite_user_id' => $userMaster->id]);

        expect($user->inviteUser)->toBeInstanceOf(User::class)
            ->and($user->inviteUser->id)->toBe($userMaster->id);
    });

    it('statuses unit', function () {
        $unit = Unit::factory()->create();
        $status1 = Status::factory()->create(['unit_id' => $unit->id]);
        $status2 = Status::factory()->create(['unit_id' => $unit->id]);

        $this->assertInstanceOf(HasMany::class, $unit->statuses());

        $this->assertCount(2, $unit->statuses);

        $this->assertTrue($unit->statuses->contains($status1));
        $this->assertTrue($unit->statuses->contains($status2));
    });

    it('employees user', function () {
        $user = User::factory()->create();
        $employee1 = Employee::factory()->create(['user_id' => $user->id]);
        $employee2 = Employee::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(HasMany::class, $user->employees());

        $this->assertCount(2, $user->employees);

        $this->assertTrue($user->employees->contains($employee1));
        $this->assertTrue($user->employees->contains($employee2));
    });

    it('scheduleLogs user', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $scheduleLog1 = ScheduleLog::factory()->create(['user_id' => $user->id]);
        $scheduleLog2 = ScheduleLog::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(HasMany::class, $user->scheduleLogs());

        $this->assertCount(4, $user->scheduleLogs); // 4 - із за фабрики, яка створює schedule
        $this->assertTrue($user->scheduleLogs->contains($scheduleLog1));
        $this->assertTrue($user->scheduleLogs->contains($scheduleLog2));
    });
});

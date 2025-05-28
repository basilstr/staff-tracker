<?php

use App\Models\Employee;
use App\Models\Status;
use App\Models\Unit;

mutates(Employee::class);

describe('Status Model', function () {
    it('can create a status', function () {
        $unit = Unit::factory()->create();

        $status = Status::factory()->create(['unit_id' => $unit->id]);

        expect($status)->toBeInstanceOf(Status::class)
            ->and($status->unit->id)->toBe($unit->id);
    });

    it('has correct fillable attributes', function () {
        $status = Status::factory()->create();
        $fillableAttributes = $status->getFillable();

        expect($fillableAttributes)->toContain('unit_id')
            ->and($fillableAttributes)->toContain('sort')
            ->and($fillableAttributes)->toContain('name')
            ->and($fillableAttributes)->toContain('short_name')
            ->and($fillableAttributes)->toContain('is_group')
            ->and($fillableAttributes)->toContain('text_color')
            ->and($fillableAttributes)->toContain('bg_color');
    });

    it('has a precisely defined cast configuration', function () {
        $reflectionMethod = new ReflectionMethod(Status::class, 'casts');
        $status = new Status;
        $casts = $reflectionMethod->invoke($status);

        expect($casts)->toBe([
            'is_group' => 'boolean',
        ]);
    });
});

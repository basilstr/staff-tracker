<?php

use App\Models\Employee;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Relations\HasMany;

mutates(Unit::class);

describe('Unit Model', function () {
    it('can create a unit', function () {
        $unit = Unit::factory()->create([
            'name' => 'unit',
            'sort' => 1,
        ]);

        expect($unit)->toBeInstanceOf(Unit::class)
            ->and($unit->name)->toBe('unit')
            ->and($unit->sort)->toBe(1);
    });

    it('has correct fillable attributes', function () {
        $unit = Unit::factory()->create();
        $fillableAttributes = $unit->getFillable();

        expect($fillableAttributes)
            ->toContain('name')
            ->toContain('sort');
    });


    it('employees unit', function () {
        $unit = Unit::factory()->create();
        $employee1 = Employee::factory()->create(['unit_id' => $unit->id]);
        $employee2 = Employee::factory()->create(['unit_id' => $unit->id]);

        $this->assertInstanceOf(HasMany::class, $unit->employees());

        $this->assertCount(2, $unit->employees);

        $this->assertTrue($unit->employees->contains($employee1));
        $this->assertTrue($unit->employees->contains($employee2));
    });
});

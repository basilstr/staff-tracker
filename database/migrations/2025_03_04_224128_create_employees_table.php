<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
            $table->string('rank', 32);
            $table->string('name');
            $table->string('note')->nullable();
            $table->string('text_color', 16)->default('#000000');
            $table->string('bg_color', 16)->default('#ffffff');
            $table->integer('sort')->default(0);
            $table->string('invite')->nullable()->index()->comment('group invitation is set if user == null, if user is set - invite is null');
            $table->timestamp('expired_at')->nullable()->index()->comment('invitation validity period');
            $table->foreignId('created_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

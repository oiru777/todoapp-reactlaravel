<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
	{
	    Schema::create('todos', function (Blueprint $table) {
    $table->id();
    $table->string('content');
    $table->date('due_date')->nullable();  // ここ追加
    $table->timestamps();
    $table->boolean('done')->default(false);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};

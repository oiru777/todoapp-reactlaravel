<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;
    // $fillable を使うことで、不正に変更されないように
    protected $fillable = [
    'content',
    'due_date',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    
}

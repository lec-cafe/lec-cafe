<?php

namespace App\Providers;

use App\Repository\TaskRepository;
use App\Repository\TaskRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repository\TaskMockRepository;

class TaskServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        app()->singleton(TaskRepositoryInterface::class,function(){
//            return new TaskMockRepository();
            return new TaskRepository();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}

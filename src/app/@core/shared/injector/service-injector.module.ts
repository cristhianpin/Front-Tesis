import { Injector, NgModule } from '@angular/core';

export let ServiceInjector: Injector;

@NgModule()
export class ServiceInjectorModule {
  constructor(private injector: Injector) {
    ServiceInjector = this.injector;
  }
}

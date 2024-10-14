import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPageSqlPageRoutingModule } from './test-page-sql-routing.module';

import { TestPageSqlPage } from './test-page-sql.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestPageSqlPageRoutingModule
  ],
  declarations: [TestPageSqlPage]
})
export class TestPageSqlPageModule {}

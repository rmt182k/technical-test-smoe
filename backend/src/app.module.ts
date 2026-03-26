import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestMaterialModule } from './request-material/request-material.module';
import { DepartmentsModule } from './departments/departments.module';
import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { MaterialsModule } from './materials/materials.module';
import { UomModule } from './uom/uom.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'material_request',
      autoLoadEntities: true,
      synchronize: true, // Schema already exists, adding uoms
    }),
    RequestMaterialModule,
    DepartmentsModule,
    UsersModule,
    SuppliersModule,
    MaterialsModule,
    UomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

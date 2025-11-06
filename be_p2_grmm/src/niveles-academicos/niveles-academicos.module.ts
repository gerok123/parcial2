import { Module } from '@nestjs/common';
import { NivelesAcademicosService } from './niveles-academicos.service';
import { NivelesAcademicosController } from './niveles-academicos.controller';
import { NivelAcademico } from './entities/nivel-academico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NivelAcademico])],
  controllers: [NivelesAcademicosController],
  providers: [NivelesAcademicosService],
})
export class NivelesAcademicosModule {}

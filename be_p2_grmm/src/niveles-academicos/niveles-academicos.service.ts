import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNivelAcademicoDto } from './dto/create-nivel-academico.dto';
import { UpdateNivelAcademicoDto } from './dto/update-nivel-academico.dto';
import { NivelAcademico } from './entities/nivel-academico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NivelesAcademicosService {
  constructor(
    @InjectRepository(NivelAcademico)
    private nivelesAcademicosRepository: Repository<NivelAcademico>,
  ) {}

  async create(
    createNivelAcademicoDto: CreateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    let nivelAcademico = await this.nivelesAcademicosRepository.findOneBy({
      nombre: createNivelAcademicoDto.nombre.trim(),
    });
    if (nivelAcademico)
      throw new ConflictException('El nivel academico ya existe');

    nivelAcademico = new NivelAcademico();
    Object.assign(nivelAcademico, createNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivelAcademico);
  }

  async findAll(): Promise<NivelAcademico[]> {
    return this.nivelesAcademicosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<NivelAcademico> {
    const nivelAcademico = await this.nivelesAcademicosRepository.findOneBy({
      id,
    });
    if (!nivelAcademico)
      throw new NotFoundException('El nivel academico no existe');
    return nivelAcademico;
  }

  async update(
    id: number,
    updateNivelAcademicoDto: UpdateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    const nivelAcademico = await this.findOne(id);
    Object.assign(nivelAcademico, updateNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivelAcademico);
  }

  async remove(id: number): Promise<NivelAcademico> {
    const nivelAcademico = await this.findOne(id);
    return this.nivelesAcademicosRepository.softRemove(nivelAcademico);
  }
}

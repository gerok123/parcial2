import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private programasRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    let programa = await this.programasRepository.findOneBy({
      nombre: createProgramaDto.nombre,
      idNivelAcademico: createProgramaDto.idNivelAcademico,
      version: createProgramaDto.version,
    });
    if (programa) throw new ConflictException('El Programa ya existe');

    programa = new Programa();
    Object.assign(programa, createProgramaDto);
    return this.programasRepository.save(programa);
  }

  async findAll(): Promise<Programa[]> {
    return this.programasRepository.find({
      relations: {
        nivelAcademico: true, 
      },
      select: {
        id: true,
        nombre: true,
        duracionMeses: true,
        costo: true,
        fechaInicio: true,
        estado: true,
        nivelAcademico: {
          id: true,
          nombre: true,
          descripcion: true,
        },
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Programa> {
    const programa = await this.programasRepository.findOne({
      where: { id },
      relations: { nivelAcademico: true  },
    });
    if (!programa) throw new NotFoundException('El programa no existe');
    return programa;
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto): Promise<Programa> {
    const programa = await this.programasRepository.findOneBy({ id });
    if (!programa) throw new NotFoundException('El programa no existe');

    Object.assign(programa, updateProgramaDto);
    return this.programasRepository.save(programa);
  }

  async remove(id: number): Promise<Programa> {
    const programa = await this.findOne(id);
    return this.programasRepository.softRemove(programa);
  }
}

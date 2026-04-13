import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUserRole: Role) {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'desc' },
    });

    return users.map((user) => ({
      ...user,
      accessCode:
        currentUserRole === Role.DIRETTORE ? user.accessCode : '••••••',
    }));
  }

  async create(currentUserRole: Role, dto: CreateUserDto) {
    if (currentUserRole === Role.RESPONSABILE) {
      if (dto.role === Role.DIRETTORE || dto.role === Role.VICE_DIRETTORE) {
        throw new ForbiddenException(
          'Il responsabile non può creare utenti direttore o vice direttore',
        );
      }
    }

    if (currentUserRole === Role.VICE_DIRETTORE) {
      if (dto.role === Role.DIRETTORE) {
        throw new ForbiddenException(
          'Il vice direttore non può creare utenti direttore',
        );
      }
    }

    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        accessCode: dto.accessCode,
        role: dto.role,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(currentUserRole: Role, id: number, dto: UpdateUserDto) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      throw new NotFoundException('Utente non trovato');
    }

    const targetIsDirector = targetUser.role === Role.DIRETTORE;
    const targetIsViceDirector = targetUser.role === Role.VICE_DIRETTORE;
    const targetIsDirectorOrVice = targetIsDirector || targetIsViceDirector;

    if (currentUserRole !== Role.DIRETTORE && typeof dto.accessCode !== 'undefined') {
      throw new ForbiddenException(
        'Solo il direttore può modificare i codici accesso',
      );
    }

    if (currentUserRole === Role.RESPONSABILE) {
      if (targetIsDirectorOrVice) {
        throw new ForbiddenException(
          'Il responsabile non può modificare direttore o vice direttore',
        );
      }

      if (dto.role === Role.DIRETTORE || dto.role === Role.VICE_DIRETTORE) {
        throw new ForbiddenException(
          'Il responsabile non può promuovere a direttore o vice direttore',
        );
      }

      if (typeof dto.isActive !== 'undefined' && targetIsDirectorOrVice) {
        throw new ForbiddenException(
          'Il responsabile non può disattivare direttore o vice direttore',
        );
      }
    }

    if (currentUserRole === Role.VICE_DIRETTORE) {
      if (targetIsDirector) {
        throw new ForbiddenException(
          'Il vice direttore non può modificare il direttore',
        );
      }

      if (dto.role === Role.DIRETTORE) {
        throw new ForbiddenException(
          'Il vice direttore non può promuovere a direttore',
        );
      }

      if (typeof dto.isActive !== 'undefined' && targetIsDirectorOrVice) {
        throw new ForbiddenException(
          'Solo il direttore può disattivare direttore e vice direttore',
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(typeof dto.fullName !== 'undefined' ? { fullName: dto.fullName } : {}),
        ...(typeof dto.role !== 'undefined' ? { role: dto.role } : {}),
        ...(typeof dto.isActive !== 'undefined' ? { isActive: dto.isActive } : {}),
        ...(typeof dto.accessCode !== 'undefined' ? { accessCode: dto.accessCode } : {}),
      },
    });
  }
}
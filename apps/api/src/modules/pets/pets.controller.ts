import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { PetsService } from "./pets.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { CreatePetNoteDto } from "./dto/create-pet-note.dto";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Get(':petId/overview')
  async getOverview(
    @CurrentUser() user: AuthenticatedUser,
    @Param('petId') petId: string,
  ) {
    return this.petsService.getOverview(
      user.userId,
      petId,
    );
  }
  /**
   * Upload avatar riêng, trả URL để FE gắn vào CreatePetDto.avatarUrl hoặc
   * UpdatePetDto.avatarUrl. Tách khỏi POST/PATCH để không phải đổi 2 endpoint
   * đó từ JSON sang multipart.
   */
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_AVATAR_SIZE_BYTES },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}.`,
      );
    }

    const result = await this.cloudinaryService.uploadImage(file.buffer, {
      folder: `vpetid/pets/${user.userId}`,
    });

    return { url: result.url, publicId: result.publicId };
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePetDto,
  ) {
    return this.petsService.create(user.userId, dto);
  }

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.petsService.findMine(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') petId: string,
  ) {
    return this.petsService.findOne(
      user.userId,
      petId,
    );
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') petId: string,
    @Body() dto: UpdatePetDto,
  ) {
    return this.petsService.update(
      user.userId,
      petId,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') petId: string,
  ) {
    return this.petsService.remove(
      user.userId,
      petId,
    );
  }

  @Post(':petId/notes')
  async createNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('petId') petId: string,
    @Body() dto: CreatePetNoteDto,
  ) {
    return this.petsService.createNote(
      user.userId,
      petId,
      dto,
    );
  }

  @Post(':petId/public-profile')
  async togglePublicProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Param('petId') petId: string,
  ) {
    return this.petsService.togglePublicProfile(
      user.userId,
      petId,
    );
  }
}
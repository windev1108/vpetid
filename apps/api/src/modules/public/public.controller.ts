import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/strategies/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { User } from "src/generated/prisma/client";
import { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { PetsService } from "../pets/pets.service";
import { Throttle } from "@nestjs/throttler";
import { ShareLocationDto } from "./dto/share-location.dto";
import { PublicService } from "./public.service";

@Controller('public')
export class PublicController {
    constructor(
        private readonly petsService: PetsService,
        private readonly publicService: PublicService,

    ) { }

    @Get('/pets/:id')
    getPublicPet(
        @Param('id') petId: string,
    ) {
        return this.petsService.findOnePublic(
            petId,
        );
    }

    @Throttle({ default: { limit: 3, ttl: 60_000 } }) // tối đa 3 lần / phút / IP
    @Post('/:id/share-location')
    shareLocation(
        @Param('id') petId: string,
        @Body() dto: ShareLocationDto,
    ) {
        return this.publicService.shareLocation(petId, dto);
    }
}
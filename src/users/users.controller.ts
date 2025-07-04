

import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateCompassDto } from './dto/update-compass.dto';
import { UpdatePrepKitDto } from './dto/update-prep-kit.dto';
import { UpdateDiscoverabilityDto } from './dto/update-discoverability.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        // req.user is populated by the JwtStrategy
        const { password, ...user } = req.user.toObject();
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('/profile/compass')
    updateCompassResults(@Req() req, @Body() updateCompassDto: UpdateCompassDto) {
        const userId = req.user._id;
        return this.usersService.updateCompass(userId, updateCompassDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/profile/prep-kit')
    updatePrepKit(@Req() req, @Body() updatePrepKitDto: UpdatePrepKitDto) {
        const userId = req.user._id;
        return this.usersService.updatePrepKit(userId, updatePrepKitDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/profile/discoverability')
    updateDiscoverability(@Req() req, @Body() updateDiscoverabilityDto: UpdateDiscoverabilityDto) {
        const userId = req.user._id;
        return this.usersService.updateDiscoverability(userId, updateDiscoverabilityDto.isDiscoverable);
    }

    @Get('qualified-candidates')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('surgeon')
    getQualifiedCandidates() {
        return this.usersService.findQualifiedCandidates();
    }
}

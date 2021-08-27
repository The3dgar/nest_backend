import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@ApiTags('Passengers')
@ApiBearerAuth()
@UseGuards(TokenGuard)
@Controller('api/v1/passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  create(@Body() passenger: PassengerDTO) {
    return this.passengerService.create(passenger);
  }

  @Get()
  findAll() {
    return this.passengerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() passenger: PassengerDTO) {
    return this.passengerService.update(id, passenger);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.passengerService.delete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}

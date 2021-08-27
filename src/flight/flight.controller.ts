import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { PassengerService } from 'src/passenger/passenger.service';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';

@ApiTags("Flights")
@ApiBearerAuth()
@UseGuards(TokenGuard)
@Controller('api/v1/flight')
export class FlightController {
  constructor(
    private readonly flighService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}

  @Post()
  create(@Body() flight: FlightDTO) {
    return this.flighService.create(flight);
  }

  @Get()
  findAll() {
    return this.flighService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flighService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() flight: FlightDTO) {
    return this.flighService.update(id, flight);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.flighService.delete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }

  @Post(':id/passenger/:paxId')
  async addPassenger(@Param('id') id: string, @Param('paxId') paxId: string) {
    const pax = await this.passengerService.findOne(paxId);

    if (!pax)
      throw new HttpException('Passenger not found', HttpStatus.NOT_FOUND);

    return this.flighService.addPassenger(id, paxId);
  }
}

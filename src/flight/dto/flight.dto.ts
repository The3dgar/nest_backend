import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class FlightDTO {
  @ApiProperty()
  @IsString()
  readonly pilot: string;

  @ApiProperty()
  @IsString()
  readonly airplane: string;
  @ApiProperty()
  @IsString()
  readonly destinationCity: string;
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  readonly flightDate: Date;
}

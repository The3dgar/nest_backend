import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import { Model } from 'mongoose';
import { FlightInterface } from 'src/common/interfaces/flight.interface';
import {
  LocationInterface,
  WeatherInterface,
} from 'src/common/interfaces/weather.interface';
import { FlightModel, PassengerModel } from 'src/common/models/models';
import { FlightDto } from './dto/flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FlightModel.name)
    private readonly model: Model<FlightInterface>,
  ) {}

  async getLocation(city: string): Promise<LocationInterface> {
    const { data } = await axios.get<LocationInterface[]>(
      `https://www.metaweather.com/api/location/search/?query=${city}`,
    );

    return data[0];
  }

  async getWeather(cityId: number, date: Date): Promise<WeatherInterface[]> {
    const dateFormat = moment(date).format('YYYY/MM/DD');
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/${cityId}/${dateFormat}`,
    );

    return data;
  }

  assign(
    {
      _id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
    }: FlightInterface,
    weather: WeatherInterface[],
  ): FlightInterface {
    return Object.assign({
      _id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }

  async create(flight: FlightDto): Promise<FlightInterface> {
    return await new this.model(flight).save();
  }

  async findAll(): Promise<FlightInterface[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<FlightInterface> {
    const flight = await this.model.findById(id).populate(PassengerModel.name);
    const { woeid }: LocationInterface = await this.getLocation(
      flight.destinationCity,
    );

    const weather: WeatherInterface[] = await this.getWeather(
      woeid,
      flight.flightDate,
    );

    return this.assign(flight, weather);
  }

  async update(id: string, flight: FlightDto): Promise<FlightInterface> {
    return await this.model.findByIdAndUpdate(id, flight, { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
  }

  async addPassenger(
    flightId: string,
    paxId: string,
  ): Promise<FlightInterface> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: {
            passengers: paxId,
          },
        },
        { new: true },
      )
      .populate(PassengerModel.name);
  }
}

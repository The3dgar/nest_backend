import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { FlightInterface } from 'src/common/interfaces/flight.interface';
import {
  LocationInterface,
  WeatherInterface,
} from 'src/common/interfaces/weather.interface';
import { FlightModel, PassengerModel } from 'src/common/models/models';
import { FlightDTO } from './dto/flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FlightModel.name)
    private readonly model: Model<FlightInterface>,
  ) {}

  async getLocation(city: string): Promise<LocationInterface> {
    const { data } = await axios.get<LocationInterface[]>(
      `${process.env.WEATHER_API}/search/?query=${city}`,
    );

    return data[0];
  }

  async getWeather(cityId: number, date: Date): Promise<WeatherInterface[]> {
    const dateFormat = moment(date).format('YYYY/MM/DD');
    const { data } = await axios.get(
      `${process.env.WEATHER_API}/${cityId}/${dateFormat}`,
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

  async create(flight: FlightDTO): Promise<FlightInterface> {
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

  async update(id: string, flight: FlightDTO): Promise<FlightInterface> {
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

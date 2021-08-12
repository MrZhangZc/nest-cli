module.exports = (line, hump, shump, path) => `
import { ${hump}Service } from './${line}.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  Patch,
  Delete
} from '@nestjs/common';

@Controller('${path}')
export class ${hump}Controller {
  constructor(private readonly ${shump}Service: ${hump}Service) {}

  @Post()
  public async create(@Body() body) {
    return await this.${shump}Service.create(body),
  }

  @Get()
  public async getList(@Query() { start, length, id, name }) {
    return await this.${shump}Service.find(start, length, id, name)
  }

  @Patch(':id')
  public async updateStatus( @Param() { id }, @Body() body) {
    return await this.${shump}Service.updateById(id, body);
  }

  @Put('edit/:id')
  public async update(@Param() { id }, @Body() body) {
    return await this.${shump}Service.updateById(id, body);
  }

  @Delete(':id')
  public async delete(@Param() { id }){
    return await this.${shump}Service.deleteById(id);
  }
}
`
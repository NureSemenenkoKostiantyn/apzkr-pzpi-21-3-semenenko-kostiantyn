import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { PreferencesService } from './preferences/preferences.service';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly preferencesService: PreferencesService
  ) {}

  @Get()
  async getMatches( @CurrentUser() user: UserDto) {
    return this.matchesService.findPotentialMatches(user);
  }

  @Post('accept/:id')
  async acceptMatch(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.matchesService.acceptMatch(user, id);
  }

  @Post('reject/:id')
  async rejectMatch(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.matchesService.rejectMatch(user, id);
  }

  @Post('preferences')
  async updatePreferences(@CurrentUser() user: UserDto, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.preferencesService.updatePreferences(user, updatePreferencesDto);
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: UserDto) {
    return this.preferencesService.getPreferences(user._id);
  }

  @Get('history')
  async getMatchHistory(@CurrentUser() user: UserDto) {
    return this.matchesService.getMatchHistory(user);
  }

}

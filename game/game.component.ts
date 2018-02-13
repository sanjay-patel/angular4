import {Component, Input, AfterViewInit, ElementRef, OnInit, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';
import { ConfigService } from '../../services/config.service';
import { GamesService } from '../../services/games.service';

import { Game } from '../../model/game';
import {AssetArray} from '../../model/assetArray';


declare let jQuery: any;
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'my-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
 })

export class GamesComponent implements OnInit, AfterViewInit {
    @Input() gamedata: Game;
    public assetArray: AssetArray = {};
    constructor(private el: ElementRef, public _dataService: DataService, public routingService: RoutingService,
                public configService: ConfigService, public gamesService: GamesService) {
    }

    ngOnInit() {
        this.assetArray = this._dataService.getAllAsset();
    }

    ngAfterViewInit() {
    }

    ImgOnClick(imgInfo) {
         jQuery(imgInfo).fadeIn(500).delay(2000).fadeOut('slow');
    }

    playNowBtn() {
        let isPlayerLogged = this.configService.getLocalStoragePlayerLoggedIn();
        // console.log('gamedata=======', this.gamedata);
        // console.log('isPlayerLogged=======', isPlayerLogged);

        if(isPlayerLogged === true) {
            let gameUrl = this._dataService.getYggdrasilRealModeGameUrl();
            let playerData = this._dataService.getPlayerAllData();
            let skinName = this._dataService.getSkin();

            switch (this.gamedata['vendor']) {
              case 'NetEnt':
                this.gamesService.startNetentGame(this.gamedata['metaGameName'], '');
                break;
              case 'Yggdrasil':
                this.gamesService.startYggdrasilGame(gameUrl, this.gamedata['metaGameName'], playerData['yggdrasilSessionId'], skinName);
                break;
            }
          } else {
            this.routingService.routingRedirect('/game-Details', this.gamedata.gameUrlName);
          }
    }

    informationBtn() {
      this.routingService.routingRedirect('/game-info', this.gamedata.gameUrlName);
    }



}

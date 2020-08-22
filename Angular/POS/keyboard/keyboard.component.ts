import { Component, OnInit } from '@angular/core';
import { ckyb } from '../commmon/ckybClass';
import { ckybaRequest } from '../commmon/ckybaClass';
import { KeyboardService } from './keyboard.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.css'],
    providers: [KeyboardService]
})

export class KeyboardComponent implements OnInit {
    constructor(private objKeyboardService: KeyboardService, private slimLoadingBarService: SlimLoadingBarService) {
    }

    ckybaKeys = [];
    ckyb: ckyb;
    ckybaRequest: ckybaRequest;
    keyboardKey = {
        key1: '',
        key2: '',
        key3: '',
        key4: '',
        keyLabel: '',
        securityPrompt: '',
        confirmation: '',
        lowerLimit: 0,
        highLimit: 0,
        threehold: 0,
        allOver: '',
        kybaid: 0
    }
    

    ngOnInit() {
        this.ckyb = new ckyb();
        this.ckybaRequest = new ckybaRequest();
        this.ckyb.kybpid = 0;
        this.ckyb.kybds = "RORC Sunset - Image";
        this.ckyb.kybsno = 99;
        this.ckyb.kytcd = "T";
        this.ckyb.kybvscd = "SS";
        this.ckybaRequest.kybid = 244;
        //this.submitSaveckyb(this.ckyb);
        //this.getAllckybList();
        this.getAllckyba(this.ckybaRequest);
        
    }

    colors = {
        "WH": "white",
        "GR": "green",
        "BL": "blue"
    };

    singleKeyDefault = {
        csracd: "",
        kyaoid: 0,
        kybacd: "",
        kybacnf: "",
        kybadv: 0,
        kybahl: 0,
        kybaid: 0,
        kybaimg: "",
        kybakey1: "-1",
        kybakey2: "",
        kybakey3: "",
        kybakey4: "",
        kybalbl: "label",
        kyball: 0,
        kybalsn: "",
        kybasr: "",
        kybathr: 0,
        kybatp: "",
        kybaval: "",
        kybclr: "GR",
        kybid: 244,
        kyblaid: 0,
        kyboid: 0,
        kybpao: " ",
        kybvln: "",
        prdcd: 0
    }
    
    onKeyDrop(e: any, dropKey: any) {
        debugger;
        // Get the dropped data here
        if (dropKey != null)
        {
            if (e.dragData.kybakey1 > -1)
            {
                this.ckybaKeys[dropKey.kybakey1.trim() - 1].kybclr = this.ckybaKeys[e.dragData.kybakey1.trim() - 1].kybclr;
                this.ckybaKeys[dropKey.kybakey1.trim() - 1].kybalbl = this.ckybaKeys[e.dragData.kybakey1.trim() - 1].kybalbl;
                
                this.ckybaKeys[e.dragData.kybakey1.trim() - 1].kybclr = "";
                this.ckybaKeys[e.dragData.kybakey1.trim() - 1].kybalbl = "";
            }
            else
            {
                this.ckybaKeys[dropKey.kybakey1.trim() - 1].kybclr = e.dragData.kybclr;
                this.ckybaKeys[dropKey.kybakey1.trim() - 1].kybalbl = e.dragData.kybalbl;
            }
        }
        else {
        }
    }


    submitSaveckyb(ckyb) {
        debugger;
        this.objKeyboardService.submitSaveckyb(this.ckyb).subscribe(data => {
            // Read the result field from the JSON response.
            debugger;
            var result = data;
        });
    }

    getAllckyba(ckybaRequest) {
        this.startLoading();
        debugger;
        this.objKeyboardService.getAllckyba(ckybaRequest).subscribe(data => {
            debugger;
            if (data.success)
            {
                this.ckybaKeys = data.ckybaResponse;
            }
            else
            {
            }
            this.completeLoading();
        })
        
    }

    updateAllckyba() {
        debugger;
        this.startLoading();
        if (this.ckybaKeys != null) {
            this.objKeyboardService.updateAllckyba(this.ckybaKeys).subscribe(data => {
                debugger;
                if (data.success) {
                    this.getAllckyba(this.ckybaRequest);
                }
                else {

                }
                this.stopLoading();
            })
            
        }
    }

    keyClick(ckybaKey)
    {
        debugger;
        console.log(ckybaKey);
        this.keyboardKey.key1 = ckybaKey.kybakey1.trim();
        this.keyboardKey.key2 = ckybaKey.kybakey2.trim();
        this.keyboardKey.key3 = ckybaKey.kybakey3.trim();
        this.keyboardKey.key4 = ckybaKey.kybakey4.trim();
        this.keyboardKey.keyLabel = ckybaKey.kybalbl.trim();
        this.keyboardKey.lowerLimit = ckybaKey.kyball;
        this.keyboardKey.highLimit = ckybaKey.kybahl;
        this.keyboardKey.threehold = ckybaKey.kybathr;
        this.keyboardKey.kybaid = ckybaKey.kybaid;
        this.keyboardKey.securityPrompt = ckybaKey.kybasr;
        this.keyboardKey.confirmation = ckybaKey.kybacnf;
        this.keyboardKey.allOver = ckybaKey.kybpao;   
    }

    changeKeyValue(changeKey)
    {
        debugger;
        this.ckybaKeys[changeKey.key1.trim() - 1].kybakey1 = changeKey.key1.trim();
        this.ckybaKeys[changeKey.key1.trim() - 1].kybakey2 = changeKey.key2.trim();
        this.ckybaKeys[changeKey.key1.trim() - 1].kybakey3 = changeKey.key3.trim();
        this.ckybaKeys[changeKey.key1.trim() - 1].kybakey4 = changeKey.key4.trim();
        this.ckybaKeys[changeKey.key1.trim() - 1].kybalbl = changeKey.keyLabel.trim();
        this.ckybaKeys[changeKey.key1.trim() - 1].kyball = changeKey.lowerLimit;
        this.ckybaKeys[changeKey.key1.trim() - 1].kybahl = changeKey.highLimit;
        this.ckybaKeys[changeKey.key1.trim() - 1].kybathr = changeKey.threehold;
    }

    changeSecurityReprompt(e, changeKey)
    {
        debugger;
        changeKey.securityPrompt = e.target.checked == true ? 'Y' : 'N';
        this.ckybaKeys[changeKey.key1.trim() - 1].kybasr = changeKey.securityPrompt;
    }
    changeConfirmation(e, changeKey) {
        debugger;
        changeKey.confirmation = e.target.checked == true ? 'Y' : 'N';
        this.ckybaKeys[changeKey.key1.trim() - 1].kybacnf = changeKey.confirmation;
    }
    changeAllOver(e, changeKey) {
        debugger;
        changeKey.allOver = e.target.checked == true ? 'Y' : 'N';
        this.ckybaKeys[changeKey.key1.trim() - 1].kybpao = changeKey.allOver;
    }
    startLoading() {
        this.slimLoadingBarService.start(() => {
            console.log('Loading complete');
        });
    }

    stopLoading() {
        this.slimLoadingBarService.stop();
    }

    completeLoading() {
        this.slimLoadingBarService.complete();
    }

}

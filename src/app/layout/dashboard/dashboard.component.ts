import { Component, OnInit, AfterViewInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { filter, map, tap, flatMap } from 'rxjs/operators';


declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    wasmReady = new BehaviorSubject<boolean>(false)
    module: any
    lnsocket: any

    constructor() {
    }

    public async connectNode(ip_addr: string, node_id: string): Promise<any> {
      /* Connect to the lightning node */
      const LNSocket = await lnsocket_init();

      this.lnsocket = LNSocket();

      this.lnsocket.genkey();

      await this.lnsocket.connect_and_init(node_id, ip_addr)
    }

    public async populateData(rune: string): Promise<any> {
      var b = await this.lnsocket.rpc({ method: "listbalances", rune });
      this.balances = b.result['accounts'];

      var ie = await this.lnsocket.rpc({ method: "listincome", rune });
      this.incomeEvents = ie.result['income_events'];
      for (var idx = 0; idx < this.incomeEvents.length; idx++) {
	      this.incomeEvents[idx].credit = parseInt(this.incomeEvents[idx].credit)
	      this.incomeEvents[idx].debit = parseInt(this.incomeEvents[idx].debit)
      }

      var i = await this.lnsocket.rpc({ method: "listinvoices", rune });
      this.invoices = i.result['invoices'];

      var p = await this.lnsocket.rpc({ method: "listpays", rune });
      this.pays = await p.result['pays'];

      this.showData = true
    }

    public showData: Boolean = false

    public balances: Array<any> = []
    public invoices:Array<any> = []
    public incomeEvents: Array<any> = []
    public pays: Array<any> = []

    // public balances: Array<any> = [
    //   {
    //     'account': 'wallet',
    //     'balances': [{'balance': '9981515000msat', 'coin_type': 'bcrt'}]
    //   }, {
    //     'account': 'a5b23dff5177badd6df725cefeb83ceccbfc52dc64a16b38894a41f0ad8fa181',
    //     'balances': [{'balance': '12981515000msat', 'coin_type': 'bcrt'}]
    //   }, {
    //     'account': '27a4a4dd880e861e390517de3e786a237c5ad1f00faab277382664e76b5c3870',
    //     'balances': [{'balance': '19981515000msat', 'coin_type': 'bcrt'}]
    //   }
    // ]
    // public invoices:Array<any> = [
    //   {
    //     'label': '1',
    //     'bolt11': 'lnbcrt100n1p3z6ywzpp5545vx6adm7jdjk6eahfvjmaw0yuts05qcnjluujg6972av0kxmtsdq8deh47vgxqyjw5qcqp9sp5hlc5srkkuf20wv0q536faap05d90v37s5c4lxeztjxru4mzp6mks9qxsqyssq32kp2dyvcvvvteekqya4ycd5kp9pszx56044qsvwq9pm2q7pj0vrwhvseng8funma294u3nr74pzgn5jqqvjp73r8pqrkph45j4m3ucqcvsuzv',
    //     'payment_hash': 'a568c36baddfa4d95b59edd2c96fae7938b83e80c4e5fe7248d17caeb1f636d7',
    //     'msatoshi': 1138191000,
    //     'amount_msat': '10000msat',
    //     'status': 'paid',
    //     'pay_index': 1,
    //     'msatoshi_received': 1138191000,
    //     'amount_received_msat': '10000msat',
    //     'paid_at': 1647120835,
    //     'payment_preimage': 'c70178f722ac40a86d0142bdfeea984fac97fffcb11137995f3a7cb76db255ef',
    //     'description': 'no_1',
    //     'expires_at': 1647725634
    //   }, {
    //     'label': '3',
    //     'bolt11': 'lnbcrt100n1p3z6ywrpp5f4f87n2al6z42wq26m9qh6f527d7sd695vpnsm3uf2agxxcngvysdq8deh47vcxqyjw5qcqp9sp5fnp04ejl5jktrjvtm5xxcejq4awv2u39ghsnmhtrtswf3t04pgpq9qxsqyssqu6e7nuq29cr4phn7nwlyrj4jmug7xgykcs78pm56npa60nkykvz8xvuk27dj6kyfx5deeh6apcntts7fy3s5edp73fclphzwla74x7gqh6xl4d',
    //     'payment_hash': '4d527f4d5dfe8555380ad6ca0be934579be83745a303386e3c4aba831b134309',
    //     'msatoshi': 1110020000,
    //     'amount_msat': '10000msat',
    //     'status': 'paid',
    //     'pay_index': 2,
    //     'msatoshi_received': 111002000,
    //     'amount_received_msat': '10000msat',
    //     'paid_at': 1647120836,
    //     'payment_preimage': '9de956f89a7a7c414e20791e544c29d9b3009c8b334c03e2d7e9ecc9d73cd5de',
    //     'description': 'no_3',
    //     'expires_at': 1647725635
    //   }, {
    //     'label': '3',
    //     'bolt11': 'lnbcrt100n1p3z6ywrpp5f4f87n2al6z42wq26m9qh6f527d7sd695vpnsm3uf2agxxcngvysdq8deh47vcxqyjw5qcqp9sp5fnp04ejl5jktrjvtm5xxcejq4awv2u39ghsnmhtrtswf3t04pgpq9qxsqyssqu6e7nuq29cr4phn7nwlyrj4jmug7xgykcs78pm56npa60nkykvz8xvuk27dj6kyfx5deeh6apcntts7fy3s5edp73fclphzwla74x7gqh6xl4d',
    //     'payment_hash': '4d527f4d5dfe8555380ad6ca0be934579be83745a303386e3c4aba831b134309',
    //     'msatoshi': 1230010000,
    //     'amount_msat': '10000msat',
    //     'status': 'paid',
    //     'pay_index': 2,
    //     'msatoshi_received': 1230010000,
    //     'amount_received_msat': '10000msat',
    //     'paid_at': 1647120837,
    //     'payment_preimage': '9de956f89a7a7c414e20791e544c29d9b3009c8b334c03e2d7e9ecc9d73cd5de',
    //     'description': 'no_3',
    //     'expires_at': 1647725635
    //   }, {
    //     'label': '3',
    //     'bolt11': 'lnbcrt100n1p3z6ywrpp5f4f87n2al6z42wq26m9qh6f527d7sd695vpnsm3uf2agxxcngvysdq8deh47vcxqyjw5qcqp9sp5fnp04ejl5jktrjvtm5xxcejq4awv2u39ghsnmhtrtswf3t04pgpq9qxsqyssqu6e7nuq29cr4phn7nwlyrj4jmug7xgykcs78pm56npa60nkykvz8xvuk27dj6kyfx5deeh6apcntts7fy3s5edp73fclphzwla74x7gqh6xl4d',
    //     'payment_hash': '4d527f4d5dfe8555380ad6ca0be934579be83745a303386e3c4aba831b134309',
    //     'msatoshi': 1142001000,
    //     'amount_msat': '10000msat',
    //     'status': 'paid',
    //     'pay_index': 2,
    //     'msatoshi_received': 1142001000,
    //     'amount_received_msat': '10000msat',
    //     'paid_at': 1647120838,
    //     'payment_preimage': '9de956f89a7a7c414e20791e544c29d9b3009c8b334c03e2d7e9ecc9d73cd5de',
    //     'description': 'no_3',
    //     'expires_at': 1647725635
    //   }
    // ]
    // public incomeEvents: Array<any> = [
    //   {
    //     'account': 'a5b23dff5177badd6df725cefeb83ceccbfc52dc64a16b38894a41f0ad8fa181',
    //     'tag': 'onchain_fee',
    //     'credit': 0,
    //     'debit': 980000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120683,
    //     'txid': '90a11b87bcf865ae3f7d0c94d44a05072dcd32f27fc9ab01dfc6e144a7e61e26'
    //   }, {
    //     'account': '27a4a4dd880e861e390517de3e786a237c5ad1f00faab277382664e76b5c3870',
    //     'tag': 'onchain_fee',
    //     'credit': 0,
    //     'debit': 13024000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120675,
    //     'txid': '5b78b9b8c84385182533c4b3004d6dbe9bb86a4af2d8ce01674d1fb36383d135'
    //   }, {
    //     'account': 'wallet',
    //     'tag': 'onchain_fee',
    //     'credit': 0,
    //     'debit': 3277000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120678,
    //     'txid': '2685b28db8196821933961dea5dae0b608ba46e81c4b5202f12ec94df57a473e'
    //   }, {
    //     'account': '27a4a4dd880e861e390517de3e786a237c5ad1f00faab277382664e76b5c3870',
    //     'tag': 'onchain_fee',
    //     'credit': 0,
    //     'debit': 1224000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120680,
    //     'txid': '203f8599381a9ea6371c1bbd914c55aedb067844b4b432e2ea9bd6a5d6da91f4'
    //   }, {
    //     'account': 'wallet',
    //     'tag': 'deposit',
    //     'credit': 20000000,
    //     'debit': 0,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120683,
    //     'outpoint': 'f9717f0809d842619c11e2f85a398df778186db2c94c78c73b2490a90cc0a23f:0'
    //   }, {
    //     'account': 'a5b23dff5177badd6df725cefeb83ceccbfc52dc64a16b38894a41f0ad8fa181',
    //     'tag': 'lease_fee',
    //     'credit': 6432000,
    //     'debit': 0,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120684
    //   }, {
    //     'account': '27a4a4dd880e861e390517de3e786a237c5ad1f00faab277382664e76b5c3870',
    //     'tag': 'lease_fee',
    //     'credit': 0,
    //     'debit': 6432000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120685
    //   }, {
    //     'account': 'a5b23dff5177badd6df725cefeb83ceccbfc52dc64a16b38894a41f0ad8fa181',
    //     'tag': 'invoice',
    //     'credit': 1000000,
    //     'debit': 0,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120688,
    //     'payment_id': '0b08781f3ffec55a1cf11ff950805359dce03af94de3b543ff82e9d3d97a4f32'
    //   }, {
    //     'account': '27a4a4dd880e861e390517de3e786a237c5ad1f00faab277382664e76b5c3870',
    //     'tag': 'invoice',
    //     'credit': 1000000,
    //     'debit': 0,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120689,
    //     'payment_id': 'e082b925ba5b872a0376a32ac3bfc539ecab12e9f3dd8b20e5c49710300cca2e'
    //   }, {
    //     'account': 'wallet',
    //     'tag': 'journal_entry',
    //     'credit': 0,
    //     'debit': 660000,
    //     'currency': 'bcrt',
    //     'timestamp': 1647120695
    //   }
    // ]
    // public pays: Array<any> = [{
    //   'bolt11': 'lnbcrt100n1p3z6ywzpp5545vx6adm7jdjk6eahfvjmaw0yuts05qcnjluujg6972av0kxmtsdq8deh47vgxqyjw5qcqp9sp5hlc5srkkuf20wv0q536faap05d90v37s5c4lxeztjxru4mzp6mks9qxsqyssq32kp2dyvcvvvteekqya4ycd5kp9pszx56044qsvwq9pm2q7pj0vrwhvseng8funma294u3nr74pzgn5jqqvjp73r8pqrkph45j4m3ucqcvsuzv',
    //   'destination': '022d223620a359a47ff7f7ac447c85c46c923da53389221a0054c11c1e3ca31d59',
    //   'payment_hash': 'a568c36baddfa4d95b59edd2c96fae7938b83e80c4e5fe7248d17caeb1f636d7',
    //   'status': 'complete',
    //   'created_at': 1647120834,
    //   'preimage': 'c70178f722ac40a86d0142bdfeea984fac97fffcb11137995f3a7cb76db255ef',
    //   'amount_msat': 10000,
    //   'amount_sent_msat': 10000
    // }]
    public incomeTags: Array<string> = [
      "deposit",
      "withdrawal",
      "penalty",
      "invoice",
      "routed",
      "pushed",
      "channel_open",
      "channel_close",
      "delayed_to_us",
      "htlc_timeout",
      "htlc_fulfill",
      "htlc_tx",
      "to_wallet",
      "ignored",
      "anchor",
      "to_them",
      "penalized",
      "stolen",
      "to_miner",
      "lease_fee",
      "journal_entry",
      "penalty_adj",
      "invoice_fee"
    ]

    public async runShowData(e) {
      e.preventDefault();
      var rune = "NZG2PwTxSltQt3JMtlbwz1dxOdNnnssWH5Sztk6pKdM9MTEmbWV0aG9kXmxpc3R8bWV0aG9kXmdldHxtZXRob2Q9c3VtbWFyeSZtZXRob2QvZ2V0c2hhcmVkc2VjcmV0Jm1ldGhvZC9saXN0ZGF0YXN0b3Jl";

      const hostname = "ws://104.131.77.55:9999";
      const node_id =  "02cca6c5c966fcf61d121e3a70e03a1cd9eeeea024b26ea666ce974d43b242e636";
      if (this.lnsocket === undefined) {
	      await this.connectNode(hostname, node_id)
      }

      await this.populateData(rune);
      this.mixedChartEtl();
      this.lineChartEtl();
      this.donughtChartEtl();
      this.mixedLineChartEtl();
      this.profitAndLossEtl();
      this.polarChartEtl();
    }


    public totalDebit: any = 0
    public totalCredit: any = 0

    public sumNums(chartData: any[]): any {
      var s = chartData.reduce((sum, current) => sum + current, 0)
      return s
    }
    // 1 BTC == 10,000,000 sats; 1sat == 1000 msats

    public totalEvents: any = this.incomeEvents.length;
    public incomeTotal: any = this.getIncomeTotal();
    public paysTotal: any = this.getPaysTotal();


    public getIncomeTotal(): any {
      var incomeTotal: any = 0
      for (var i in this.incomeEvents) {
        var ie = this.incomeEvents[i]
        var debit: any = ie['debit'];
        var credit: any = ie['credit'];
        incomeTotal += credit;
        incomeTotal -= debit;
      }
      return incomeTotal/1000;
    }

    public getPaysTotal(): any {
      var paysTotal: any = 0;
      for (var i in this.pays) {
        var p = this.pays[i]
        paysTotal += p['amount_sent_msat']
      }
      return paysTotal/1000;
    }


    // donughtchart chart
    public donughtchartOptions: any = {
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        cutoutPercentage: 30,
        responsive: true,
        aspectRatio: '1',
        legend: {
            display: false,
        },
        title: {
            display: false,
            text: 'Chart.js Doughnut Chart'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
    public donughtchartLabels: string[] = [];
    public donughtchartType: string;
    public donughtchartLegend: boolean;

    public randomColor() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return `rgba(${r}, ${g}, ${b}, 0.7)`
    }


    public donughtchartData: any[] = [
        {
            data: [],
            // backgroundColor: ['rgba(240, 240, 240, 0.5)', '#5B92FF', '#1FC96E', '#F85778', '#F85779'],
            backgroundColor: [],
            // backgroundColor: ['#5B92FF', '#1FC96E', '#F85778', '#F85779'],
            // backgroundColor: [],
            label: 'Dataset 1'
        }
    ];

    public donughtChartEtl() {
      for (var i in this.balances) {
        var balance = parseInt(this.balances[i]['balances'][0]['balance']);
        var account = this.balances[i]['account'];
        this.donughtchartData[0]['data'].push(balance/1000);
        this.donughtchartData[0]['backgroundColor'].push(this.randomColor());
        this.donughtchartLabels.push(account.slice(0,6));
      }
    }



    // anything you have received Payment id matches payment hash
    // preimage is proof of payment

    // public getPercentOnChainTransactions(): {
    //
    // }

    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    // summaryChart1 chart
    public summaryChart1Options: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            enabled: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [
                {
                    display: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }
            ],
            yAxes: [
                {
                    display: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }
            ]
        }
    };
    public summaryChart1Labels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public summaryChart1Type: string;
    public summaryChart1Legend: boolean;
    public LNSocket

    public summaryChart1Data: any[] = [
        {
            data: [65, 59, 80, 81, 56, 55, 40],
            label: 'Series A',
            backgroundColor: 'transparent',
            borderColor: '#FFFFFF',
            borderWidth: '1.5',
            radius: 0,
            fill: false
        }
    ];

    // summaryChart2 chart
    public summaryChart2Options: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            enabled: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: false
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        display: false
                    },
                    display: false,
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }
            ]
        }
    };
    public summaryChart2Labels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public summaryChart2Type: string;
    public summaryChart2Legend: boolean;

    public summaryChart2Data: any[] = [
        {
            data: [65, 59, 80, 81, 56, 55, 40],
            label: 'Series A',
            backgroundColor: '#FFFFFF',
            borderColor: 'transparent',
            borderWidth: '1.5',
            radius: 0,
            fill: false
        }
    ];

    // mixedchartjs chart
    public mixedchartjsOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0
            }
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart - Stacked Area'
        },
        tooltips: {
            mode: 'index'
        },
        hover: {
            mode: 'index'
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    display: true,
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }
            ]
        }
    };
    public mixedchartjsLabels: string[] = [];

    public mixedchartjsType: string;
    public mixedchartjsLegend: boolean;

    public mixedchartjsData: any[] = [
        {
            label: 'Credit',
            borderWidth: '1',
            borderColor: 'rgba(144, 181, 255, 0)',
            backgroundColor: 'rgba(91, 146, 255, 0.70) ',
            data: []
        },
        {
            label: 'Debit',
            borderWidth: '1',
            backgroundColor: '#ff6e73',
            borderColor: '#ff6e73',
            data: []
        }
    ];

    public mixedChartEtl() {
      for (var i in this.incomeEvents) {
        var debit = this.incomeEvents[i]['debit']/1000
        var credit = this.incomeEvents[i]['credit']/1000
        var t = this.incomeEvents[i]['timestamp']
        if (debit > 0) {
          this.mixedchartjsData[1]['data'].push(debit * -1);
          this.mixedchartjsData[0]['data'].push(0);
          this.totalDebit += debit
        }
        if (credit > 0) {
          this.mixedchartjsData[0]['data'].push(credit);
          this.mixedchartjsData[1]['data'].push(0);
          this.totalCredit += credit
        }
        this.mixedchartjsLabels.push(this.formatTime(t));
      }
    }

    public profitAndLossOptions: any = {
        responsive: true,
        maintainAspectRatio: true,
        elements: {
            point: {
                radius: 0
            }
        },
        title: {
            display: false,
            text: 'Total Profit And Loss'
        },
        tooltips: {
            mode: 'index'
        },
        hover: {
            mode: 'index'
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: false,
                        fontColor: '#90b5ff'
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Total  |  Profit  |  Loss '
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    display: true,
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }
            ]
        }
    };
    public profitAndLossLabels: string[] = [''];

    public profitAndLossType: string;
    public profitAndLossLegend: boolean;


    // Profit and loss chart
    public profitAndLossData: any[] = [
      {
        label: 'Total',
        borderWidth: '0',
        backgroundColor: '#1FC96E',
        borderColor: '#1FC96E',
        data: [],
      },
      {
        label: 'Profit',
        borderWidth: '0',
        backgroundColor: 'rgba(91, 146, 255, 0.70)',
        borderColor: 'rgba(91, 146, 255, 0.70)',
        data: [],
      },
      {
        label: 'Loss',
        borderWidth: '0',
        backgroundColor: '#ff6e73',
        borderColor: '#ff6e73',
        data: [],
      },
    ]

    public profitAndLossEtl(): any {
      var profit = 0
      var loss = 0
      for (var i in this.incomeEvents) {
        profit += this.incomeEvents[i]['credit'];
        loss += this.incomeEvents[i]['debit'];
      }
      var total = profit - loss;
      this.profitAndLossData[0]['data'].push(total / 1000)
      this.profitAndLossData[1]['data'].push(profit / 1000)
      this.profitAndLossData[2]['data'].push((loss * -1) / 1000)
    }

    // line chart
    public mixedlinechartjsOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
          point: {
              radius: 0
          }
      },
      title: {
          display: false,
          text: 'Chart.js Line Chart - Stacked Area'
      },
      tooltips: {
          mode: 'index'
      },
      hover: {
          mode: 'index'
      },
      legend: {
          display: false
      },
      scales: {
          xAxes: [
              {
                  ticks: {
                      display: true,
                      fontColor: '#90b5ff'
                  },
                  scaleLabel: {
                      display: false,
                      labelString: 'Month'
                  }
              }
          ],
          yAxes: [
              {
                  ticks: {
                      display: true,
                      fontColor: '#90b5ff'
                  },
                  display: true,
                  stacked: true,
                  scaleLabel: {
                      display: false,
                      labelString: 'Value'
                  }
              }
          ]
      }
    };
    public mixedlinechartjsLabels: string[] = [];

    public mixedlinechartjsType: string;
    public mixedlinechartjsLegend: boolean;

    public mixedlinechartjsData: any[] = [

    ];

    // Polar chart
    public polarchartOptions: any = {
        responsive: true,
            legend: {
                display: false,
                position: 'right',
            },
            title: {
                display: false,
                text: 'Chart.js Polar Area Chart'
            },
            // scale: {
            //     ticks: {
            //         beginAtZero: true
            //     },
            //     reverse: false
            // },
            animation: {
                animateRotate: false,
                animateScale: true
            }
    };
    public polarchartLabels: string[] = [];
    public polarchartType: string;
    public polarchartLegend: boolean;

    public polarchartData: any[] = [
        {
            data: [],
            backgroundColor: [
                '#ff6e73',
                '#ff7600',
                '#ffc322',
                '#0fddad',
                '#5B92FF',
            ],
            borderColor: 'rgb(0, 0, 0, 0)',
            label: 'My dataset' // for legend
        }
    ];

    public polarChartEtl() {
      var dataByTag: any = {}
      for (var i in this.incomeEvents) {
        var debit = this.incomeEvents[i]['debit']/1000;
        var credit = this.incomeEvents[i]['credit']/1000;
        var total = credit + debit;
        var t = this.incomeEvents[i]['timestamp']
        var tag = this.incomeEvents[i]['tag']
        if (dataByTag.hasOwnProperty(tag)) {
          dataByTag[tag] += total
        } else {
          console.log(tag)
          dataByTag[tag] = total
        }
      }
      for (var i in dataByTag) {
        this.polarchartLabels.push(i);
        this.polarchartData[0]['data'].push(dataByTag[i]);
      }
    }

    public mixedLineChartEtl() {
      for (var i in this.incomeEvents) {
        var debit = this.incomeEvents[i]['debit']/1000;
        var credit = this.incomeEvents[i]['credit']/1000;
        var total = credit - debit;
        var t = this.incomeEvents[i]['timestamp']
        var tag = this.incomeEvents[i]['tag']
        var hasDataWithTag: Boolean
        if (this.mixedlinechartjsData.length > 0) {
          for (var i in this.mixedlinechartjsData) {
            hasDataWithTag = false
            if (this.mixedlinechartjsData[i]['label'] === tag){
              hasDataWithTag = true
              this.mixedlinechartjsData[i]['data'].push(total)
            } else {
              this.mixedlinechartjsData[i]['data'].push(0)
            }
          }
        }
        if (!hasDataWithTag) {
          this.mixedlinechartjsData.push({
            data: [total],
            label: tag,
            borderWidth: '2',
            borderColor: this.randomColor(),
            backgroundColor: 'rgba(0, 0, 0, 0)'
          })
        }
        this.mixedlinechartjsLabels.push(this.formatTime(t));
      }
    }

    public lineChartEtl() {
      for (var i in this.invoices) {
        var amount = this.invoices[i]['msatoshi_received'] / 1000;
        var t = this.formatTime(this.invoices[i]['paid_at']);
        this.linechartlargeData[0]['data'].push(amount);
        this.linechartlargeLabels.push(t);
      }
    }

    // linechartlarge chart
    public linechartlargeOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0
            }
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart - Stacked Area'
        },
        tooltips: {
            mode: 'index'
        },
        hover: {
            mode: 'index'
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    display: false,
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }
            ]
        }
    };
    public linechartlargeLabels: string[] = [];
    public linechartlargeType: string;
    public linechartlargeLegend: boolean;

    public linechartlargeData: any[] = [
        {
            data: [],
            label: 'Invoices',
            borderWidth: '2',
            borderColor: '#efe9e9',
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        // {
        //     data: [],
        //     label: 'Invoices',
        //     borderWidth: '2',
        //     borderColor: '#efe9e9',
        //     backgroundColor: 'rgba(0, 0, 0, 0)'
        // }
    ];

    // barcharts chart
    public barchartsOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false,
            position: 'top'
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: true,
                        fontColor: '#90b5ff'
                    },
                    categoryPercentage: 0.3,
                    barPercentage: 1,
                    barThickness: 5
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart'
        }
    };
    public barchartsLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    public barchartsType: string;
    public barchartsLegend: boolean;

    public barchartsData: any[] = [
        {
            label: 'Dataset 1',
            backgroundColor: '#efe9e9',
            borderColor: '#efe9e9',
            borderWidth: 1,
            data: [30, 20, 35, 15, 20]
        },
        {
            label: 'Dataset 2',
            backgroundColor: '#5B92FF',
            borderColor: '#5B92FF',
            borderWidth: 1,
            data: [35, 26, 25, 45, 30]
        }
    ];

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [Math.round(Math.random() * 100), 59, 80, Math.random() * 100, 56, Math.random() * 100, 40];
        const clone = JSON.parse(JSON.stringify(this.summaryChart1Data));
        clone[0].data = data;
        this.summaryChart1Data = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

    public formatTime(unix_timestamp: any): any {
      // let unix_timestamp = 1549312452
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(unix_timestamp * 1000);
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDay();
      // return date
      // Hours part from the timestamp
      var hours = date.getHours();
      // // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();
      //
      // // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      var formattedDate = day + '/' + month;
      // return formattedTime;
      return formattedDate + ' ' + formattedTime
      // return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      // return new Date(unix_timestamp * 1000).getDate();

    }

    ngOnInit() {
        this.summaryChart1Type = 'line';
        this.summaryChart2Type = 'bar';
        this.mixedchartjsType = 'bar';
        this.profitAndLossType = 'bar';
        this.mixedlinechartjsType = 'line';
        this.donughtchartType = 'doughnut';
        this.linechartlargeType = 'line';
        this.barchartsType = 'bar';
        this.polarchartType = 'pie';
        // this.polarchartType = 'polarArea';

	/* Connect to the lightning node */

        $('#mapwrap').vectorMap({
            map: 'world_mill'
        });
    }


    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

}

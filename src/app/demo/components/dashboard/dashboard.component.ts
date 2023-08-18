import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ChartOptions , ChartDataset} from 'chart.js';
import { ArticleService } from '../../service/article.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
   

  barData: { labels: string[], datasets: ChartDataset[] };
  barOptions: ChartOptions;

    products!: Product[];

    chartData: any;
   

    chartOptions: any;
   
    totalEquipments: number;
    chartEquipments: number;
    nEquipments: number;
    cEquipments: number;
    totalArticles: number;
    chartArticles: number;
    nArticles:number;
    cArticles:number;
    totalCategories: number;
    subscription!: Subscription;

    constructor(private productService: ProductService, public layoutService: LayoutService, private articleService: ArticleService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }
 

    ngOnInit() {
        this.fetchTotalEquipments();
        this.fetchTotalArticles();
        this.fetchTotalCategories();
        this.calculateStatistics();
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
     
    }
    calculateStatistics() {
      this.productService.getEquipments().subscribe(equipments => {
        // Filter equipments with 'lowstock' state
        const inStockEquipments = equipments.filter(product => product.etat === 'INSTOCK');
        const lowStockEquipments = equipments.filter(product => product.etat === 'LOWSTOCK');
        const outOfStockEquipments = equipments.filter(product => product.etat === 'OUTOFSTOCK');
        this.nEquipments= inStockEquipments.length;
        this.chartEquipments = lowStockEquipments.length;
        this.cEquipments= outOfStockEquipments.length;
        
        this.populateBarChartData();
        // Update bar chart data
        this.barData.datasets[0].data = lowStockEquipments.map(product => product.quantity);
        
      });
    
      this.articleService.getArticles().subscribe(articles => {
        const inStockArticles = articles.filter(article => article.etat === 'INSTOCK');
        const lowStockArticles = articles.filter(article => article.etat === 'LOWSTOCK');
        const outOfStockArticles = articles.filter(article => article.etat === 'OUTOFSTOCK');
        this.nArticles= inStockArticles.length;
        this.chartArticles = lowStockArticles.length;
        this.cArticles=outOfStockArticles.length;
        this.totalArticles = articles.length;
        this.populateBarChartData();
      });
    }
    
  
    populateBarChartData() {
      if (this.chartEquipments !== 0 && this.nEquipments !== 0 &&this.cEquipments !==0
         &&   this.nArticles !== 0 && this.chartArticles !== 0 && this.cArticles !== 0) {
        this.barData = {
          labels: ['Equipments INSTOCK', 'Equipments LOWSTOCK', 'Equipments OUTOFSTOCK',  'Articles INSTOCK',
          'Articles LOWSTOCK',
          'Articles OUTOFSTOCK'],
          datasets: [
            {
              label: '',
              backgroundColor: ['blue', 'orange', 'red','green',
              'purple',
              'brown'],
              borderColor: ['blue', 'orange', 'red','green',
              'purple',
              'brown'],
              data: [this.nEquipments, this.chartEquipments,  this.cEquipments,this.nArticles,
                this.chartArticles,
                this.cArticles]
            }
          ]
        };
      }
    }
  

    
  fetchTotalEquipments() {
    this.productService.getTotalEquipments().subscribe(
      (data: number) => {
        this.totalEquipments = data;
      },
      (error) => {
        console.error('Error fetching total equipment count:', error);
      }
    );
  }

  fetchTotalArticles() {
    this.productService.getTotalArticles().subscribe(
      (data: number) => {
        this.totalArticles= data;
      },
      (error) => {
        console.error('Error fetching total articles count:', error);
      }
    );
  }
  fetchTotalCategories() {
    this.productService.getTotalCategories().subscribe(
      (data: number) => {
        this.totalCategories = data;
      },
      (error) => {
        console.error('Error fetching total equipment count:', error);
      }
    );
  }


  ngOnDestroy() {
   
    if (this.subscription) {
      this.subscription.unsubscribe();
  }
  }
}



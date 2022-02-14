import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import 'bootstrap';
import {ViewportScroller} from "@angular/common";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  @ViewChild('carousel', {static: true}) carousel!: ElementRef;
  currentIndex = 1
  contributors = [{
    "contributor": "Fashion Revolution",
    "logo": "https://dq06ugkuram52.cloudfront.net/files/3765463/22301376-medium.jpg"
  },
    {
      "contributor": "Open Apparel Registry",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5661929/21257596-medium.jpg"
    },
    {
      "contributor": "AMD Akademie Mode & Design Berlin",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5467212/20834915-medium.jpg"
    },
    {
      "contributor": "Walk Free Initiative",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/1831839/12602420-medium.png"
    },
    {
      "contributor": "Clean Clothes Campaign",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/564260/12604027-medium.png"
    },
    {
      "contributor": "Columbia University SIPA",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/8104623/26042255-medium.png"
    },
    {
      "contributor": "University of Wollongong",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/2549498/12602498-medium.png"
    },
    {
      "contributor": "Glasgow Caledonian University",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/2381047/12602618-medium.png"
    },
    {
      "contributor": "Nottingham Trent University",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/3700624/14894897-medium.png"
    },
    {
      "contributor": "Universidad EAFIT",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/2593569/15069279-medium.png"
    },
    {
      "contributor": "Ewha Womans University",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/2718582/12716390-medium.jpeg"
    },
    {
      "contributor": "University of Connecticut",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/2877060/13099154-medium.png"
    },
    {
      "contributor": "Australian National University",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5295432/20444349-medium.png"
    },
    {
      "contributor": "University of Nottingham",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/3149947/13561221-medium.png"
    },
    {
      "contributor": "Global Reporting Initiative",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/801180/12603989-medium.jpg"
    },
    {
      "contributor": "Ellen MacArthur Foundation",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5405942/20706304-medium.png"
    },
    {
      "contributor": "Textile Exchange",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5406497/20709161-medium.jpg"
    },
    {"contributor": "Science Based Targets Initiative", "logo": "../../assets/SBTI-logo.jpg"},
    {
      "contributor": "Poverty Footprint",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/1828145/12602552-medium.png"
    },
    {"contributor": "Business & Human Rights Resource Center", "logo": "../../assets/BHRRC-logo.png"},
    {"logo": "https://dq06ugkuram52.cloudfront.net/files/5663399/21715396-medium.jpeg", "contributor": "As You Sow"},
    {
      "contributor": "Responsible Sourcing Network",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5340655/20553116-medium.jpg"
    },
    {
      "contributor": "Accord on Fire and Building Safety in Bangladesh",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5424763/20734161-medium.png"
    },
    {
      "contributor": "Ethical Trading Initiative",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/168320/20704071-medium.jpeg"
    },
    {
      "contributor": "Fair Labor Association",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/61327/12604154-medium.gif"
    },
    {
      "contributor": "ACT Action, Collaboration, Transformation",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/5417974/20726868-medium.png"
    },
    {"contributor": "ShareAction", "logo": "https://dq06ugkuram52.cloudfront.net/files/3763173/15057247-medium.png"},
    {
      "contributor": "SustainoMetric",
      "logo": "https://dq06ugkuram52.cloudfront.net/files/8126858/26084088-medium.png"
    }];

  constructor(private scroll: ViewportScroller, private meta: Meta, private titleService: Title) {
    titleService.setTitle("Who made Apparel 100 and why?");
    meta.addTags([
      {
        name: 'keywords',
        content: 'wikirate, esg data,apparel supply chain,apparel company esg ratings,manufacturing supply chain,supply chain,supply transparency,apparel esg data,fashion esg data,esg company,esg companies,esg company rating,esg rating,esg ratings,esg ranking,esg rankings,esg data ranking,esg data rating,environmental,environmental concerns,social concerns,environmental social corporate governance,adidas esg data,data visualizations,data infographics, Laureen van Breen'
      },
      {
        name: 'description',
        content: 'Apparel 100 was made by WikiRate to showcase supply chain transparency and ESG data in an engaging and accessible way. These maps and infographics create a sector snapshot that tells a story the world deserves to know.'
      }
    ])
    meta.updateTag({
      name: 'og:title',
      content: 'Behind Apparel 100'
    }, 'property=\'og:title\'')

    meta.updateTag({
        name: 'og:url',
        content: '//showcase.wikirate.org/#/apparel_top_100/about'
      },
      'property=\'og:url\'')
    meta.updateTag({
        name: 'og:description',
        content: 'Apparel 100 was made by Wikirate.org to showcase our supply chain transparency and ESG data in an engaging and accessible way.'
      },
      'property=\'og:description\'')
    meta.updateTag({
      name: 'twitter:description',
      content: 'Apparel 100 was made by Wikirate.org to showcase our supply chain transparency and ESG data in an engaging and accessible way.'
    }, 'property=\'twitter:description\'')
    meta.updateTag({
      name: 'twitter:title',
      content: 'Behind Apparel 100'
    }, 'property=\'twitter:title\'')
  }

  ngOnInit(): void {
    this.scrollToTop();
  }

  prev() {
    this.carousel.nativeElement.carousel('prev')
  }

  next() {
    this.carousel.nativeElement.on('slid.bs.carousel', () => {
      this.carousel.nativeElement.carousel('2')
    })
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }
}

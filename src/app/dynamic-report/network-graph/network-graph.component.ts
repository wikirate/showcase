import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Network, DataSet, Node, Edge} from 'vis-network/standalone/esm/vis-network.min';
import {ActivatedRoute, Params} from "@angular/router";
import {ApparelService} from "../../services/apparel.service";

@Component({
  selector: 'network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.scss']
})
export class NetworkGraphComponent implements OnInit {
  @ViewChild('net', {static: false}) net!: ElementRef;
  // @ts-ignore
  report_params: { year: number | string, id: number };
  // @ts-ignore
  paramsSubscription: Subscription;
  // @ts-ignore
  network: { nodes: [], edges: [] };
  title = '';
  network_graph:any;

  constructor(private http: HttpClient, private route: ActivatedRoute,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.report_params = {
      id: this.route.snapshot.params['id'],
      year: this.route.snapshot.params['year']
    }
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
        this.report_params.id = params['id'];
        this.report_params.year = params['year'];
        this.network = {nodes: [], edges:[]};
        if (this.network_graph != null) {
          this.renderer.removeChild(this.net.nativeElement, this.network_graph)
        }

        this.http.get<any>('../../assets/networks/'+this.report_params.year+'/' + this.report_params.id+'.json')
          .subscribe(response => {
            let n = response.network;
            this.network = n;
            if(n.nodes.length > 0) {
              this.title = response.title;
              this.network_graph = this.renderer.createElement('div');
              this.network_graph.class = "col-11";
              this.network_graph.id = "network_graph";
              this.renderer.appendChild(this.net.nativeElement, this.network_graph)
              this.draw();
            }
          })
      }
    );
  }

  draw() {
    // @ts-ignore
    const nodes = new DataSet<Node, "id">(this.network.nodes);

    // @ts-ignore
    const edges = new DataSet<Edge, "id">(this.network.edges);

    let container = document.getElementById("network_graph");
    let data = {
      nodes: nodes,
      edges: edges
    };
    let options = {
      edges: {
        color: {
          color: '#D3D3D3',
          highlight: "#63607a",
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
            type: "arrow"
          }
        },
        font: {
          face: 'IBMPlexSans',
          size: 10
        }
      },
      nodes: {
        shape: 'dot',
        font: {
          face: 'IBMPlexSans',
          size: 13
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        stabilization: {
          enabled: true,
          iterations: 100,
          updateInterval: 1000,
          onlyDynamicEdges: false,
          fit: true
        }
      },
      layout: { improvedLayout: false }
    };
    // @ts-ignore
    var network = new Network(container, data, options);
  }
}

import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Network, DataSet, Node, Edge} from 'vis-network/standalone/esm/vis-network.min';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.scss']
})
export class NetworkGraphComponent implements OnInit {
  // @ts-ignore
  report_params: { year: number, id: number };
  // @ts-ignore
  paramsSubscription: Subscription;
  // @ts-ignore
  network: { nodes: [], edges: [] };
  title = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.report_params = {
      id: this.route.snapshot.params['id'],
      year: this.route.snapshot.params['year']
    }
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
        this.report_params.id = params['id'];
        this.report_params.year = params['year'];
        this.http.get<any>('../../assets/networks/'+this.report_params.year+'/' + this.report_params.id+'.json')
          .subscribe(response => {
            let n = response.network;
            for (let i = 0; i < n.nodes.length; i++) {
              n.nodes[i]['id'] = n.nodes[i]['_id'];
              delete n.nodes[i]['_id'];
            }
            for (let i = 0; i < n.edges.length; i++) {
              n.edges[i]['id'] = n.edges[i]['_id'];
              delete n.edges[i]['_id'];
            }
            console.log(n.nodes[0]['color'])
            this.network = n;
            this.title = response.title;
            this.draw();
          })
      }
    );
  }

  draw() {
    // @ts-ignore
    const nodes = new DataSet<Node, "id">(this.network.nodes);

    // @ts-ignore
    const edges = new DataSet<Edge, "id">(this.network.edges);

    let container = document.getElementById("network");
    let data = {
      nodes: nodes,
      edges: edges
    };
    let options = {
      title: this.title,
      improvedLayout: false,
      edges: {
        color: {
          color: '#D3D3D3',
          highlight: "#A9A9A9",
        },
        arrows: {
          to: {
            enabled: true,
            imageHeight: undefined,
            imageWidth: undefined,
            scaleFactor: 2,
            src: undefined,
            type: "arrow"
          }
        },
        font: {
          face: 'IBMPlexSans',
          size: 10,
          color: {
            color: '#F7F7F8',
            highlight: "#171832",
          }
        }
      },
      nodes: {
        shape: 'dot',
        size: 10,
        font: {
          face: 'IBMPlexSans',
          size: 13
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          theta: 0.5,
          gravitationalConstant: -70,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        stabilization: {
          enabled: true,
          iterations: 10,
          updateInterval: 1000,
          onlyDynamicEdges: false,
          fit: true
        }
      }
    };
    // @ts-ignore
    var network = new Network(container, data, options);
  }
}

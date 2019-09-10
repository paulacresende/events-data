import React, { Component } from 'react';
import api from '../services/api';
import check from '../assets/check.svg';
import calendar from '../assets/calendar.svg';
import clock from '../assets/clock.svg';
import place from '../assets/place.svg';
import money from '../assets/money.svg';
import './Events.css';

class Events extends Component {

  //constructor é chamado antes que este componente (Events) seja montado
  //super (props) deve ser chamado para que o this.props não seja indefinido no constructor
  constructor(props) {
    super(props);
    this.state = {
      eventos: [],
    }
  }
  //após um componente ser montado, o DidMount é invocado
  //para carregar os dados do endpoint
  componentDidMount() {
    api.get('/events.json')
      .then((response) => {
        //atualiza o estado de eventos
        this.setState({
          eventos: response.data.events,
        });
      })
      //caso não haja retorno da api, exibe mensagem de erro
      .catch((error) =>
        console.log(error)
      );
  }

  //para filtrar por event "comprou"
  comprouDados(element) {
    return element.event === "comprou"
  };

  ordenaAgrupaDados = (obj) => {
    //ordena eventos de compra por ordem decrescente de timestamp
    let newObj = obj.filter(this.comprouDados).sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    //agrupa dados com mesmo numero de transacao
    let transactions = [];
    Object.values(newObj).forEach(data => {
      let transaction = {
        transaction_id: data.custom_data.find(k => k.key === "transaction_id").value,
        revenue: data.revenue,
        date: data.timestamp,
        store_name: data.custom_data.find(k => k.key === "store_name").value
      };

      transactions.push(transaction);
    });
    return transactions;
  }

  //agrupa produtos com mesmo numero de transacao
  ordenaAgrupaProduto = (obj, transaction_id) => {
    let newObj = obj.filter(function (element) {
      return element.event === "comprou-produto" && element.custom_data.find(v => v.value === transaction_id)
    });

    let products = [];
    Object.values(newObj).forEach(data => {
      let product = {
        product_name: data.custom_data.find(k => k.key === "product_name").value,
        product_price: data.custom_data.find(k => k.key === "product_price").value
      };
      products.push(product);
    });
    return products;
  }
  //renderizando elementos na tela
  render() {
    var { eventos } = this.state;
    return (
      <ul className="timeline">
        {
          this.ordenaAgrupaDados(eventos).map((info, index) => {
            return (
              <li className="timeline-li" key={index}>
                <img src={check} alt="check" />

                <div className="timeline-box">
                  <div className="box-info">
                    <div>
                      <img src={calendar} alt="calendar" />
                      {new Intl.DateTimeFormat('pt-br').format(new Date(info.date))}
                    </div>
                    <div>
                      <img src={clock} alt="clock" />
                      {new Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' }).format(new Date(info.date))}
                    </div>
                    <div>
                      <img src={place} alt="place" />
                      {info.store_name}
                    </div>
                    <div>
                      <img src={money} alt="money" />
                      {new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(info.revenue)}
                    </div>
                  </div>
                  <div className="product-info">
                    <table>
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.ordenaAgrupaProduto(eventos, info.transaction_id).map((info, index) => {
                            return (
                              <tr key={index}>
                                <td>{info.product_name}</td>
                                <td>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(info.product_price)}</td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

export default Events;
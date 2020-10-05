import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "styled-components";

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;

  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    align-items: center;

    .count {
      background: white;
      padding: 2px 5px;
    }

    .active {
      background: var(--yellow);
    }

    &[aria-current="page"] {
      background: var(--yellow);
    }
  }
`;

function countPizzasWithTopping(pizzas) {
  const allToppings = pizzas.map((pizza) => pizza.toppings).flat();

  const countedToppings = allToppings.reduce((acc, topping) => {
    const existingTopping = acc[topping.id];
    if (existingTopping) {
      existingTopping.count += 1;
    } else {
      acc[topping.id] = { count: 1, ...topping };
    }
    return acc;
  }, {});

  const sortedToppings = Object.values(countedToppings).sort(
    (a, b) => b.count - a.count
  );

  return sortedToppings;
}

export default function ToppingsFilter() {
  const { pizzas } = useStaticQuery(graphql`
    query {
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);

  // Count how many pizzas use each topping
  const toppingsWithCounts = countPizzasWithTopping(pizzas.nodes);

  return (
    <ToppingsStyles>
      <Link to="/pizzas/">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link to={`/topping/${topping.name}`} key={topping.id}>
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}

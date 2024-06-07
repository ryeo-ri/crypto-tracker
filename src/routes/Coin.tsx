import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import Price from "./Pirce";
import Chart from "./Chart";
import { faetchCoinInfo, faetchCoinTickers } from "../api";
import { useQuery } from "@tanstack/react-query";

const Title = styled.h1`
  font-size: 40px;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 200;
  color: ${(props) => props.theme.titleColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  height: 15vh;
  align-items: center;
  border-top: 10px solid ${(props) => props.theme.barColor};
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px 20px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 7px 0px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;


interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch(`${process.env.PUBLIC_URL}/${coinId}/price`);
  const chartMatch = useRouteMatch(`${process.env.PUBLIC_URL}/${coinId}/chart`);
  //useQuery 사용하여 호출
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>({
    queryKey: ["info", coinId],
    queryFn: () => faetchCoinInfo(String(coinId)),
  });
  const { isLoading: tickerLoading, data: tickerData } = useQuery<PriceData>({
    queryKey: ["tickers", coinId],
    queryFn: () => faetchCoinTickers(String(coinId)),
  });

  const loading = infoLoading || tickerLoading;

  /* useQuery 사용하지 않고 API 호출 
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
    useEffect(() => {
      (async () => {
        const infoData = await (
          await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
        ).json();
        const priceData = await(
          await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
        ).json();
        setInfo(infoData);
        setPriceInfo(priceData);
        setLoading(false);
      })();      
    }, [coinId])
*/
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
         <Link to={`${process.env.PUBLIC_URL}`}>
         back 
        </Link>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickerData?.quotes.USD.price.toFixed(4)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickerData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickerData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`${process.env.PUBLIC_URL}/${coinId}/price`}>
                Price
              </Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`${process.env.PUBLIC_URL}/${coinId}/chart`}>
                Chart
              </Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`${process.env.PUBLIC_URL}/${coinId}/price`}>
              <Price />
            </Route>
            <Route path={`${process.env.PUBLIC_URL}/${coinId}/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}
export default Coin;

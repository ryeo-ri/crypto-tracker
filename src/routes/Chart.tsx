import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

const ChartBox = styled.div`
  text-align: center;
  display: block;
  max-width: 500px;
  margin-left: -10px;
`;

interface ChartProps {
  coinId: string;
}

interface LodaerProps {
  text: string;
}

interface ChatData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<ChatData[]>({
    queryKey: ["chat", coinId],
    queryFn: () => fetchCoinHistory(coinId),
  });

  //API데이터 오류 체크
  const isError = !Array.isArray(data);
  
  function Loader({ text }: LodaerProps) {
    return <span>{text}</span>;
  }

  return (
    <div>
      {isLoading ? (
        <Loader text="now Loading" />
      ) : isError ? (
        <Loader text="Data Not Found" />
      ) : (
        <ChartBox>
          <ReactApexChart
            type="candlestick"
            series={[
              {
                data: data?.map((price) => [
                  new Date(price.time_open * 1000).toUTCString(),
                  Number(price.open),
                  Number(price.high),
                  Number(price.low),
                  Number(price.close),
                ]),
              } as any,
            ]}
            options={{
              plotOptions: {
                candlestick: {
                  colors: {
                    upward: "#B0D030",
                    downward: "#70639C",
                  },
                },
              },
              theme: {
                mode: "dark",
              },
              chart: {
                height: 500,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              xaxis: {
                type: "datetime",
              },
              yaxis: {
                tooltip: {
                  enabled: true,
                },
              },
            }}
          ></ReactApexChart>
        </ChartBox>
      )}
    </div>
  );
}

export default Chart;

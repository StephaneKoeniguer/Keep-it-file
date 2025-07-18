import { useRef, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Filler,
} from "chart.js";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "../../../components/Box";
import MDTypography from "../../../components/Typography";
import gradientChartLine from "../../../../shared/assets/theme/functions/gradientChartLine";
import configs from "../../../examples/Charts/MixedChart/configs";
import colors from "../../../../shared/assets/theme/base/colors";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Filler
);

function MixedChart({ icon, title, description, height, chart }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const chartElement = chartRef.current;

    if (!chartElement) return;

    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => {
          let finalConfigs;

          const defaultLine = {
            ...dataset,
            type: "line",
            tension: 0,
            borderWidth: 4,
            pointRadius: 2,
            pointBackgroundColor: colors[dataset.color]
              ? colors[dataset.color || "dark"].main
              : colors.dark.main,
            borderColor: colors[dataset.color]
              ? colors[dataset.color || "dark"].main
              : colors.dark.main,
            maxBarThickness: 6,
          };

          const gradientLine = {
            ...dataset,
            type: "line",
            tension: 0,
            pointRadius: 0,
            borderWidth: 4,
            borderColor: colors[dataset.color]
              ? colors[dataset.color || "dark"].main
              : colors.dark.main,
            fill: true,
            maxBarThickness: 6,
            backgroundColor: gradientChartLine(
              chartElement.ctx,
              colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
            ),
          };

          const bar = {
            ...dataset,
            type: "bar",
            weight: 5,
            borderWidth: 0,
            borderRadius: 4,
            backgroundColor: colors[dataset.color]
              ? colors[dataset.color || "dark"].main
              : colors.dark.main,
            fill: false,
            maxBarThickness: 35,
          };

          const thinBar = {
            ...dataset,
            type: "bar",
            weight: 5,
            borderWidth: 0,
            borderRadius: 4,
            backgroundColor: colors[dataset.color]
              ? colors[dataset.color || "dark"].main
              : colors.dark.main,
            fill: false,
            maxBarThickness: 10,
          };

          if (dataset.chartType === "default-line") {
            finalConfigs = defaultLine;
          } else if (dataset.chartType === "gradient-line") {
            finalConfigs = gradientLine;
          } else if (dataset.chartType === "thin-bar") {
            finalConfigs = thinBar;
          } else {
            finalConfigs = bar;
          }

          return { ...finalConfigs };
        })
      : [];

    setChartData(configs(chart.labels || [], chartDatasets));
  }, [chart]);

  const { data, options } = useMemo(() => chartData, [chartData]);

  const renderChart = (
    <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
      {title || description ? (
        <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          {icon.component && (
            <MDBox
              width="4rem"
              height="4rem"
              bgColor={icon.color || "dark"}
              variant="gradient"
              coloredShadow={icon.color || "dark"}
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={-5}
              mr={2}
            >
              <Icon fontSize="medium">{icon.component}</Icon>
            </MDBox>
          )}
          <MDBox mt={icon.component ? -2 : 0}>
            {title && <MDTypography variant="h6">{title}</MDTypography>}
            <MDBox mb={2}>
              <MDTypography component="div" variant="button" color="text">
                {description}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ) : null}
      <MDBox sx={{ height }}>
        <Line
          ref={chartRef}
          data={{
            labels: data?.labels || [],
            datasets: data?.datasets || [],
          }}
          options={options}
          redraw
        />
      </MDBox>
    </MDBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of MixedChart
MixedChart.defaultProps = {
  icon: { color: "info", component: "" },
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the MixedChart
MixedChart.propTypes = {
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    component: PropTypes.node,
  }),
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default MixedChart;

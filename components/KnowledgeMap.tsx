"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ExamType, KnowledgeEdge, KnowledgeNode } from "@/lib/types";
import { getMapData } from "@/lib/data/models";
import { useAppStore } from "@/lib/store";

const typeColors: Record<string, string> = {
  concept: "#93c5fd",
  law: "#f97316",
  model: "#22c55e",
  method: "#a78bfa",
  experiment: "#f472b6",
  pitfall: "#ef4444",
};

function fullnessColor(fullness: number | undefined): string {
  if (!fullness || fullness < 40) return "#ef4444";
  if (fullness < 70) return "#eab308";
  return "#22c55e";
}

export function KnowledgeMap({
  exam,
  onNodeClick,
}: {
  exam: ExamType;
  onNodeClick?: (node: KnowledgeNode) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { modelMastery } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const svg = svgRef.current;
    if (!containerEl || !svg) return;

    // 清理前一次渲染
    d3.select(svg).selectAll("*").remove();

    const { nodes, edges } = getMapData(exam);

    // 同步模型 fullness
    nodes.forEach((n) => {
      if (n.type === "model") {
        const mm = modelMastery[n.id] || modelMastery[n.id.replace("model_", "")];
        if (mm) n.fullness = mm.masteryLevel;
      }
    });

    const width = containerEl.clientWidth;
    const height = Math.max(600, containerEl.clientHeight || 600);

    const g = d3.select(svg).attr("viewBox", `0 0 ${width} ${height}`);

    // 缩放
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        gContainer.attr("transform", event.transform);
      });
    g.call(zoom as any);

    const gContainer = g.append("g");

    // 力模拟
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(edges as any)
          .id((d: any) => d.id)
          .distance((d: any) => (d.type === "causes" ? 120 : 100))
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // 绘制边
    const link = gContainer
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, any>("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d: any) =>
        d.type === "causes" ? "#f97316" : d.type === "contradicts" ? "#ef4444" : "#94a3b8"
      )
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6);

    // 箭头标记
    const defs = g.append("defs");
    ["#94a3b8", "#f97316", "#ef4444"].forEach((color) => {
      defs
        .append("marker")
        .attr("id", `arrow-${color.replace("#", "")}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 22)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color);
    });

    link.attr("marker-end", (d: any) => `url(#arrow-${(d.type === "causes" ? "#f97316" : d.type === "contradicts" ? "#ef4444" : "#94a3b8").replace("#", "")})`);

    // 节点组
    const nodeG = gContainer
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, any>("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .call(
        d3
          .drag<any, any>()
          .on("start", (e: any, d: any) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e: any, d: any) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e: any, d: any) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // 节点圆
    nodeG
      .append("circle")
      .attr("r", (d: any) => (d.type === "model" ? 22 : d.type === "law" ? 18 : 14))
      .attr("fill", (d: any) =>
        d.type === "model" ? fullnessColor(d.fullness) : typeColors[d.type] || "#94a3b8"
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9)
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#1d4ed8").attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
      })
      .on("click", (_e: any, d: any) => {
        onNodeClick?.(d as KnowledgeNode);
      });

    // 节点文字
    nodeG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => (d.type === "model" ? 36 : 28))
      .attr("font-size", (d: any) => (d.type === "model" ? 13 : 11))
      .attr("fill", "#334155")
      .attr("font-weight", "500")
      .text((d: any) => d.label);

    // 模型完整度百分比显示
    nodeG
      .filter((d: any) => d.type === "model")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", 10)
      .attr("fill", "#fff")
      .attr("font-weight", "bold")
      .text((d: any) => `${d.fullness ?? 0}%`);

    // 节点描述 tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "fixed z-50 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg p-3 text-xs max-w-xs pointer-events-none opacity-0 transition-opacity")
      .style("font-size", "12px");

    nodeG
      .on("mouseenter", (_e: any, d: any) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<div class="font-bold mb-1">${d.label}</div>
             <div class="text-gray-600 dark:text-dark-muted">类型: ${typeLabel(d.type)}</div>
             ${d.description ? `<div class="mt-1">${d.description}</div>` : ""}`
          );
      })
      .on("mousemove", (e: any) => {
        tooltip.style("left", `${e.pageX + 12}px`).style("top", `${e.pageY + 12}px`);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // 模拟 tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      nodeG.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [exam, modelMastery, onNodeClick]);

  return (
    <div ref={containerRef} className="kmap-graph w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

function typeLabel(t: string): string {
  const map: Record<string, string> = {
    concept: "概念",
    law: "定律",
    model: "物理模型",
    method: "解题方法",
    experiment: "实验",
    pitfall: "易错点",
  };
  return map[t] || t;
}

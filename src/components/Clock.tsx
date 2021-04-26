import React, { useRef, useEffect } from "react";
import { Moment } from "moment-timezone";

// This clock is based on the tutorial from w3schools
// see: https://www.w3schools.com/graphics/canvas_clock.asp

const draw = (ctx: CanvasRenderingContext2D, radius: number, time: Moment) => {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius, time);
};

const drawFace = (ctx: CanvasRenderingContext2D, radius: number) => {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.lineWidth = radius * 0.1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
};

const drawNumbers = (ctx: CanvasRenderingContext2D, radius: number) => {
  let ang;
  let num;
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (num = 1; num < 13; num++) {
    ang = (num * Math.PI) / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
};

const drawTime = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  now: Moment
) => {
  let hour = now.hours();
  let minute = now.minutes();
  let second = now.seconds();
  //hour
  hour = hour % 12;
  hour =
    (hour * Math.PI) / 6 +
    (minute * Math.PI) / (6 * 60) +
    (second * Math.PI) / (360 * 60);
  drawHand(ctx, hour, radius * 0.5, radius * 0.07);
  //minute
  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minute, radius * 0.8, radius * 0.07);
  // second
  second = (second * Math.PI) / 30;
  drawHand(ctx, second, radius * 0.9, radius * 0.02);
};

const drawHand = (
  ctx: CanvasRenderingContext2D,
  pos: number,
  length: number,
  width: number
) => {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
};

const Canvas = (props: any) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");
    const radius = canvas.height / 2;
    context.translate(radius, radius);
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");
    const radius = (canvas.height / 2) * 0.9;

    draw(context, radius, props.time);
  }, [props.time]);

  return <canvas ref={canvasRef} className="clock" width={500} height={500} />;
};

export default Canvas;

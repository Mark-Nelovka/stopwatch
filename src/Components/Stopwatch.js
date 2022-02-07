import React, { Component } from "react";
import s from "./Stopwatch.module.css";
import { fromEvent } from "rxjs";
import { map, buffer, debounceTime, filter } from "rxjs/operators";

export default class Stopwatch extends Component {
  state = {
    intervalId: null,
    hour: "00",
    minutes: "00",
    seconds: "00",
    isActive: true,
    waitTime: 0,
    disabled: false,
  };

  start = () => {
    const startTime = Date.now();

    this.setState({
      intervalId: setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTime;

        this.setState({
          hour: this.convert(deltaTime).hours,
          minutes: this.convert(deltaTime).minutes,
          seconds: this.convert(deltaTime).seconds,
        });
      }, 1000),
    });
    this.setState({
      isActive: true,
      disabled: true,
    });
  };

  stop = () => {
    this.setState({
      intervalId: clearInterval(this.state.intervalId),
      hour: "00",
      minutes: "00",
      seconds: "00",
      isActive: true,
      waitTime: 0,
      disabled: false,
    });
  };

  MouseDown = () => {
    const click$ = fromEvent(document, "click");

    const repeatClick = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => {
        return list.length;
      }),
      filter((x) => {
        if (x === 2) {
          this.wait();
        }
      })
    );

    repeatClick.subscribe(this.wait);
  };

  waitStart = () => {
    const startTime = this.state.waitTime;
    this.setState({
      intervalId: setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTime + 1000;
        this.setState((prevState) => ({
          hour: this.convert(deltaTime).hours,
          minutes: this.convert(deltaTime).minutes,
          seconds: this.convert(deltaTime).seconds,
        }));
      }, 1000),
    });
    this.setState({
      isActive: true,
      waitTime: 0,
    });
  };

  wait = () => {
    this.setState((prevState) => ({
      intervalId: clearInterval(this.state.intervalId),
      hour: prevState.hour,
      minutes: prevState.minutes,
      seconds: prevState.seconds,
      isActive: false,
      waitTime: Date.now(),
      disabled: false,
    }));
  };

  reset = () => {
    this.setState({
      intervalId: clearInterval(this.state.intervalId),
      hour: "00",
      minutes: "00",
      seconds: "00",
      waitTime: 0,
    });

    this.start();
  };

  convert = (ms) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = String(Math.floor(ms / day)).padStart(2, "0");

    const hours = String(Math.floor((ms % day) / hour)).padStart(2, "0");

    const minutes = String(Math.floor(((ms % day) % hour) / minute)).padStart(
      2,
      "0"
    );

    const seconds = String(
      Math.floor((((ms % day) % hour) % minute) / second)
    ).padStart(2, "0");

    return { days, hours, minutes, seconds };
  };

  render() {
    const { hour, minutes, seconds, isActive, disabled } = this.state;
    return (
      <main>
        <div className={s.timer}>
          <span className={s.value}>{hour}</span>:
          <span className={s.value}>{minutes}</span>:
          <span className={s.value}>{seconds}</span>
        </div>

        <div className={s.containerBtn}>
          {isActive ? (
            <button
              disabled={disabled}
              onClick={this.start}
              className={s.btnStart}
              type="button"
            >
              Start
            </button>
          ) : (
            <button
              disabled={disabled}
              onClick={this.waitStart}
              className={s.btnStart}
              type="button"
            >
              Start
            </button>
          )}
          <button onClick={this.MouseDown} className={s.btnWait} type="button">
            Wait
          </button>
          <button onClick={this.stop} className={s.btnStop} type="button">
            Stop
          </button>
          <button onClick={this.reset} className={s.btnReset} type="button">
            Reset
          </button>
        </div>
      </main>
    );
  }
}

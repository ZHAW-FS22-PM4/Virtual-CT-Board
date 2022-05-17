import React from 'react'
import { ButtonComponent } from './button'
import { DipSwitchComponent } from './dip-switch'
import { HexSwitchComponent } from './hex-switch'
import { LcdComponent } from './lcd'
import { LedComponent } from './led'
import { SevenSegmentComponent } from './seven-segment'
import './style.css'

export class BoardComonent extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="board-component">
        <div className="board bg-success">
          <div className="chip bg-dark"></div>
          <div className="data-port n-1-8 bg-dark"></div>
          <div className="data-port n-9-16 bg-dark"></div>
          <div className="data-port n-17-24 bg-dark"></div>
          <div className="data-port n-25-32 bg-dark"></div>
          <div className="led-container n-0-7">
            <LedComponent startIndex={0} size={8} />
          </div>
          <div className="led-container n-8-15">
            <LedComponent startIndex={8} size={8} />
          </div>
          <div className="led-container n-16-23">
            <LedComponent startIndex={16} size={8} />
          </div>
          <div className="led-container n-24-31">
            <LedComponent startIndex={24} size={8} />
          </div>
          <div className="dip-switch-container n-0-7">
            <DipSwitchComponent startIndex={0} size={8} />
          </div>
          <div className="dip-switch-container n-8-15">
            <DipSwitchComponent startIndex={8} size={8} />
          </div>
          <div className="dip-switch-container n-16-23">
            <DipSwitchComponent startIndex={16} size={8} />
          </div>
          <div className="dip-switch-container n-24-31">
            <DipSwitchComponent startIndex={24} size={8} />
          </div>
          <div className="lcd-container">
            <LcdComponent />
          </div>
          <div className="buttons-container">
            <ButtonComponent startIndex={0} size={4} />
          </div>
          <div className="extension-board bg-success"></div>
          <div className="extension-display bg-dark"></div>
          <div className="gpio-port n-5 bg-dark"></div>
          <div className="gpio-port n-6 bg-dark"></div>
          <div className="glas-cover left"></div>
          <div className="glas-cover right"></div>
          <div className="seven-segment-container n-0">
            <SevenSegmentComponent displayId={0} />
          </div>
          <div className="seven-segment-container n-1">
            <SevenSegmentComponent displayId={1} />
          </div>
          <div className="seven-segment-container n-2">
            <SevenSegmentComponent displayId={2} />
          </div>
          <div className="seven-segment-container n-3">
            <SevenSegmentComponent displayId={3} />
          </div>
          <div className="hex-switch-container">
            <HexSwitchComponent />
          </div>
          <div className="potentiometer bg-dark"></div>
        </div>
      </div>
    )
  }
}

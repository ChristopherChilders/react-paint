import React from 'react';
import { v4 } from 'uuid';
import Pusher from 'pusher-js';

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.pusher = new Pusher('PUSHER_KEY', {
            cluster: 'eu',
        });
    }

    isPainting = false;

    // Different stroke styles to be used for user and guest
    userStrokeStyle = 'lime';
    // guestStrokeStyle = '#F0C987';

    line = [];

    // v4 creates a unique id for each user. Use this since there's no auth to tell users apart
    userId = v4();

    previousPosition = {offsetX: 0, offsetY: 0};

    onMouseDown({nativeEvent}){
        this.isPainting = true;
        if(this.isPainting){
            const { offsetX, offsetY } = nativeEvent;
            this.previousPosition = { offsetX, offsetY };
        }
        // console.log(' the function works')
    }
    
    onMouseMove({ nativeEvent }){
        if(this.isPainting){
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };
            // Set the start and stop position of the paint event
            const positionData = {
                start: {...this.previousPosition},
                stop: {...offSetData},
            };
            // Add the position fo the line array
            this.line = this.line.concat(positionData);
            this.paint(this.previousPosition, offSetData, this.userStrokeStyle);
        }
    }

    endPaintEvent(){
        // console.log('it is not painting anymore')
        if(this.isPainting){
            this.isPainting = false;
            this.sendPaintData();
            // console.log('it sent the paint data')
        }
    }

    paint(previousPosition, currentPosition, strokeStyle){
        const { offsetX, offsetY } = currentPosition;
        const { offsetX: x, offsetY: y } = previousPosition;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the previous position of the mouse
        this.ctx.moveTo(x,y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.previousPosition = { offsetX, offsetY };
    }

    async sendPaintData(){
        const body = {
            line: this.line,
            userId: this.userId,
        };
        // Uses the native fetch API to make requests to the server
        const req = await fetch('http://localhost:4000/paint', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
            },
        });
        const res = await req.json();
        this.line = [];
    }

    componentDidMount() {
        // Setting up the properties of the canvas element
        this.canvas.width = 1000;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;

        const channel = this.pusher.subscribe('painting');
        channel.bind('draw', (data) => {
            const { userId, line } = data;
            if(userId !== this.userId) {
                line.forEach((position) => {
                    this.paint(position.start, position.stop, this.guestStrokeStyle);
                });
            }
        });
    }

    // Where we draw the Canvas to the page
    render(){
        return (
            <canvas
                // uses the ref attribute to get access to the canvas element
                ref={(ref) => (this.canvas = ref)} 
                style={{background: 'black'}} 
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.endPaintEvent}
                onMouseUp={this.endPaintEvent}
                onMouseMove={this.onMouseMove}
            />
        );
    }
}

export default Canvas;
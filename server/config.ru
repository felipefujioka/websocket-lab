require 'rubygems'
require 'thin'
require 'rack'
require 'rack/websocket'
require_relative 'app'

class WebSocketApp < Rack::WebSocket::Application

  def initialize(options = {})
    super

    @socket_mount_point = options[:socket_mount_point]
  end

  def on_open(env)
    # Protect against connections to invalid mount points.
    if env['REQUEST_PATH'] != @socket_mount_point
      close_websocket
      puts "Closed attempted websocket connection because it's requested a mount point other than #{@socket_mount_point}"
    end

    puts "Client Connected"

    # Send a welcome message to the user over websockets.
    send_data "Connected!"
    puts "Sent message: @client Hello Client!"

    # Uncomment below for an example of routinely broadcasting to the client.
    EM.next_tick do
      counter = 0
      # The "1" here specifies interval in seconds.
      EventMachine::PeriodicTimer.new(1) do
        send_data "@client tick tock #{counter} times"
        counter += 1
      end
    end
    
  end

  def on_close(env)
    send_data "Disconnected!"
    puts "Client Disconnected"
  end

  def on_message(env, message)
    puts "Received message: #{message}"

    send_data "@client I received your message: #{message}"
  end

  def on_error(env, error)
    puts "Error occured: " + error.message
  end

end

ws = nil

map '/example' do
  ws = WebSocketApp.new(:socket_mount_point => '/example')
  run ws
end

map '/' do
  run App.new(:socket => ws)
end




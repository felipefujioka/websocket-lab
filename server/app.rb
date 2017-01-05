require 'sinatra'


class App < Sinatra::Application

  set :socket, nil

  def initialize(options={})
    super options 
    settings.socket = options[:socket]
  end

  get '/' do
    settings.socket.send_data("someone accessed / in sinatra webserver")
  end

end
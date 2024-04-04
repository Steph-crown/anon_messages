defmodule AnonMessagesWeb.SendMessagesLive do
  use AnonMessagesWeb, :live_view

  def render(assigns) do
    ~H"""
    <div
      id="send-messages"
      phx-hook="SendMessages"
      phx-update="ignore"
      data-useremail={assigns.user_by_id.email}
      data-userid={assigns.user_by_id.id}
    >
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end
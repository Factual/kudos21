require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do

    # simulate logged in omniauth user to test settings - this is in test_helper
    login

    @unsubscribedUser = users(:unsubscribed)
    @subscribedUser = users(:subscribed)
  end

  test "should get index" do
    get users_url
    assert_response :success
  end

  test "should get new" do
    get new_user_url
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count') do
      post users_url, params: { user: {  } }
    end

    assert_redirected_to user_path(User.last)
  end

  test "should show user" do
    get user_url(@user)
    assert_response :success
  end

  test "should get edit" do
    get edit_user_url(@user)
    assert_response :success
  end

  test "should post update" do
#    User.stubs(:authenticate).returns false
    post sessions_url
    post settings_url(@unsubscribedUser), params: { email_notifications: 'subscribe' }
    assert_response :success
    assert @user.reload.email_notifications == true
  end

  test "should unsubscribe post update" do
    post user_url(@subscribedUser), params: { email_notifications: 'unsubscribe' }
    assert_response :success
    assert @user.reload.email_notifications == false
  end

  test "should ajax post update" do
    post user_url(@user), params: { email_notifications: 'subscribe' }, xhr: true
    assert_response :success
    assert @user.reload.email_notifications == true
  end

  test "should ajax post update db with unsubscribe" do
    post user_url(@user), params: { email_notifications: 'unsubscribe' }, xhr: true
    assert_response :success
    assert @user.reload.email_notifications == false
  end

  test "should trigger error" do
    post user_url(@user), params: { email_notifications: 'unrecognized' }
    assert_response :failure
    assert_response :bad_request
    assert @user.reload.email_notifications == true
    assert_equal '{ error: "Incorrect parameter for email notifications." }', @response.body
    assert_equal "application/json", @response.content_type
  end


  test "should update user" do
    patch user_url(@user), params: { user: {  } }
    assert_redirected_to user_path(@user)
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
      delete user_url(@user)
    end

    assert_redirected_to users_path
  end
end

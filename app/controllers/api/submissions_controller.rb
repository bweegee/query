
  def add_student_to_quiz
    emails = params.require(:email)
      emails.each do |email|
      the_params(email)
    end
  end

  def index
    render json: current_user.submissions.all
  end

  def show
    render json: @submission
  end

  def create
    @quiz = current_user.quizzes.new(quiz_params)
    if @quiz.save
      sub = current_user.submissions.new({quiz_id: @quiz.id, user_id: params.require(:quiz)["user_id"]})
      sub.save
     render json: @quiz
    else
      render json: @quiz.errors, status: 422
    end
  end

  def update
  end

  def destroy
  end

  private

  def the_params(email)
    do_it = true
    student= User.where(email: email)
    quiz= params.require(:submission).permit(:quiz_id)
    student[0].quizzes.each do |q|
      q["id"] == quiz["quiz_id"] ? do_it = false : nil
    end
    if do_it  
      sub = Submission.new(
        quiz.merge({user_id: student[0].id.to_s})
        )
        sub.save
    end
  end

  def quiz_params
    params.require(:quiz).permit(:name, :info, :anon)
  end

  def submissions_params(quiz)


  end
end
from django.template import loader
from django.core.mail import EmailMultiAlternatives


class SendEmailMixin:
    def send_mail(
            self,
            subject,
            context,
            from_email,
            to_email,
            template_name,
            html_email_template_name=None,
    ):
        body = loader.render_to_string(template_name, context)

        email_message = EmailMultiAlternatives(
            subject, body, from_email, [to_email]
        )
        if html_email_template_name is not None:
            html_email = loader.render_to_string(html_email_template_name, context)
            email_message.attach_alternative(html_email, "text/html")

        email_message.send()

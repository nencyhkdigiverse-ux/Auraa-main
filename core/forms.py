from django import forms
from .models import BulkInquiry, NewsletterSubscriber

class NewsletterForm(forms.ModelForm):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'footer-input', 'placeholder': 'Email Address'}),
        }

class BulkInquiryForm(forms.ModelForm):
    PRODUCT_CHOICES = [
        ('200ml', 'DesiDairy 200ml'),
        ('500ml', 'DesiDairy 500ml'),
        ('1000ml', 'DesiDairy 1000ml'),
    ]
    products = forms.MultipleChoiceField(
        choices=PRODUCT_CHOICES,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'checkbox-group'}),
        required=False
    )

    class Meta:
        model = BulkInquiry
        fields = ['name', 'email', 'products', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field', 'placeholder': 'Your Name'}),
            'email': forms.EmailInput(attrs={'class': 'input-field', 'placeholder': 'Your Email'}),
            'message': forms.Textarea(attrs={'class': 'input-field', 'placeholder': 'Tell us about your needs', 'rows': 5}),
        }

    def clean_products(self):
        products_list = self.cleaned_data.get('products', [])
        return ",".join(products_list)

from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import BulkInquiryForm, NewsletterForm

def subscribe_newsletter(request):
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Successfully subscribed to the newsletter!')
        else:
            # Check if email is already subscribed
            if NewsletterSubscriber.objects.filter(email=request.POST.get('email')).exists():
                messages.info(request, 'You are already subscribed!')
            else:
                messages.error(request, 'Invalid email address.')
    
    return redirect(request.META.get('HTTP_REFERER', 'home'))

def home(request):
    return render(request, 'home.html')

def products(request):
    return render(request, 'products.html')

def quality(request):
    return render(request, 'quality.html')

def bulk_inquiry(request):
    if request.method == 'POST':
        form = BulkInquiryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your inquiry has been sent successfully! We will contact you soon.')
            return redirect('bulk_inquiry')
    else:
        form = BulkInquiryForm()
    
    return render(request, 'bulk_inquiry.html', {'form': form})

def about(request):
    return render(request, 'about.html')

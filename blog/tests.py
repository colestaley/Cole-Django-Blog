from django.test import TestCase
from django.urls import reverse
from .models import Post

class BlogTests(TestCase):
    def setUp(self):
        self.post = Post.objects.create(title="Hello", content="World")

    def test_home_status_code(self):
        url = reverse('post_list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

    def test_detail_page(self):
        url = reverse('post_detail', args=[self.post.pk])
        resp = self.client.get(url)
        self.assertContains(resp, "Hello")

# Create your tests here.

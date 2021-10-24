# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User as User_Django

from datetime import datetime
from django.db.models.functions import Now


class UseCase(models.Model):

    name = models.TextField(primary_key=True)
    title = models.TextField()
    description = models.TextField()
    narrative = models.TextField()

    class Meta:
        #managed = False
        db_table = 'use_case'

class SemanticArea(models.Model):

    name = models.TextField(primary_key=True)  # This field type is a guess.

    class Meta:
        #managed = False
        db_table = 'semantic_area'

class NameSpace(models.Model):
    ns_id = models.TextField(primary_key=True)
    description = models.TextField
    class Meta:
        #managed = False
        db_table = 'name_space'

class User(models.Model):
    #user = models.OneToOneField(User_Django, on_delete=models.CASCADE)
    username = models.CharField(primary_key=True, max_length=1000)
    password = models.CharField(max_length=32)
    profile = models.TextField()  # This field type is a guess.
    ns_id = models.ForeignKey('NameSpace',models.DO_NOTHING, db_column='ns_id')
    def __str__(self):
        return self.username

    class Meta:
        #managed = False
        db_table = 'user'


class Report(models.Model):
    id_report = models.CharField(primary_key=True, max_length=1000)
    report_json = models.JSONField()
    institute = models.TextField()
    language = models.TextField()
    batch = models.IntegerField()
    insertion_date = models.DateField()

    class Meta:
        #managed = False
        db_table = 'report'
        unique_together = (('id_report', 'language'),)


class Concept(models.Model):
    concept_url = models.TextField(primary_key=True)
    name = models.CharField(max_length=1000, blank=True, null=True)
    json_concept = models.JSONField(null=True)

    class Meta:
        #managed = False
        db_table = 'concept'


class AnnotationLabel(models.Model):
    seq_number = models.IntegerField()
    label = models.TextField(primary_key=True)


    class Meta:
        db_table = 'annotation_label'
        unique_together = (('label', 'seq_number'),)

#
# class ConceptHasUc(models.Model):
#     concept_url = models.OneToOneField('Concept', models.DO_NOTHING, db_column='concept_url', primary_key=True)
#     name = models.ForeignKey('UseCase', models.DO_NOTHING, db_column='name')
#
#     class Meta:
#         #managed = False
#         db_table = 'concept_has_uc'
#         unique_together = (('concept_url', 'name'),)


class TopicHasDocument(models.Model):
    id_report = models.OneToOneField('Report', models.DO_NOTHING, primary_key=True, db_column='id_report')
    language = models.TextField()
    name = models.ForeignKey('UseCase', models.DO_NOTHING, db_column='name')

    class Meta:
        #managed = False
        db_table = 'topic_has_document'
        unique_together = (('name', 'id_report','language'),)

class Associate(models.Model):
    id_report = models.OneToOneField('Report', models.DO_NOTHING,primary_key=True, db_column='id_report')
    language = models.TextField()
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name = models.ForeignKey('UseCase', models.DO_NOTHING, db_column='name')
    ns_id = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='ns_id')
    seq_number = models.IntegerField()
    label = models.ForeignKey(AnnotationLabel, models.DO_NOTHING, db_column='label')
    insertion_time = models.DateTimeField(blank=True, null=True)
    class Meta:
        #managed = False
        db_table = 'associate'
        unique_together = (('id_report', 'language','username','ns_id', 'seq_number', 'label'),)


class BelongTo(models.Model):
    name = models.OneToOneField('SemanticArea', models.DO_NOTHING, db_column='name', primary_key=True)
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING, db_column='concept_url')

    class Meta:
        #managed = False
        db_table = 'belong_to'
        unique_together = (('name', 'concept_url'),)


class Contains(models.Model):
    insertion_time = models.DateTimeField(blank=True, null=True)
    concept_url = models.OneToOneField(Concept, models.DO_NOTHING, db_column='concept_url', primary_key=True)
    id_report = models.ForeignKey('Report', models.DO_NOTHING, db_column='id_report')
    language = models.TextField()
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    ns_id = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='ns_id')
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING, db_column='name')
    topic_name = models.TextField()

    class Meta:
        #managed = False
        db_table = 'contains'
        unique_together = (('concept_url','topic_name', 'id_report','language', 'username', 'ns_id','name'),)

class Annotate(models.Model):
    insertion_time = models.DateTimeField(blank=True, null=True)
    #username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    name = models.ForeignKey('UseCase', models.DO_NOTHING, db_column='name')

    ns_id = models.ForeignKey('NameSpace',models.DO_NOTHING, db_column='ns_id')
    start = models.OneToOneField('Mention', models.DO_NOTHING, db_column='start', primary_key=True)
    stop = models.IntegerField()
    id_report = models.ForeignKey('Report', models.DO_NOTHING, db_column='id_report')
    language = models.TextField()
    seq_number = models.IntegerField()
    label = models.ForeignKey(AnnotationLabel, models.DO_NOTHING, db_column='label')


    class Meta:
        #managed = False
        db_table = 'annotate'
        unique_together = (('username','ns_id', 'name','start', 'stop', 'id_report','language'),)


class GroundTruthLogFile(models.Model):
    insertion_time = models.DateTimeField(primary_key=True)
    id_report = models.ForeignKey('Report', models.DO_NOTHING, db_column='id_report')
    language = models.TextField()
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    ns_id = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='ns_id')
    gt_type = models.TextField()
    gt_json = models.JSONField()
    name = models.ForeignKey('UseCase', models.DO_NOTHING, db_column='name')

    class Meta:
        #managed = False
        db_table = 'ground_truth_log_file'
        unique_together = (('insertion_time', 'id_report','language','name', 'username','ns_id'),)

class Mention(models.Model):
    mention_text = models.TextField(blank=True, null=True)
    start = models.IntegerField(primary_key=True)
    stop = models.IntegerField()
    id_report = models.ForeignKey('Report', models.DO_NOTHING, db_column='id_report')
    language = models.TextField()


    class Meta:
        #managed = False
        db_table = 'mention'
        unique_together = (('start', 'stop', 'id_report','language'),)

class Linked(models.Model):
    name = models.ForeignKey('SemanticArea', models.DO_NOTHING, db_column='name')
    username = models.ForeignKey('User', models.DO_NOTHING, db_column='username')
    ns_id = models.ForeignKey('NameSpace', models.DO_NOTHING, db_column='ns_id')
    concept_url = models.ForeignKey('Concept', models.DO_NOTHING, db_column='concept_url')
    start = models.OneToOneField('Mention', models.DO_NOTHING, db_column='start',primary_key=True)
    stop = models.IntegerField()
    id_report = models.ForeignKey('Report', models.DO_NOTHING, db_column='id_report', related_name='report')
    language = models.TextField()
    topic_name = models.TextField()

    insertion_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'linked'
        unique_together = (( 'name', 'topic_name','username','ns_id', 'concept_url', 'start', 'stop', 'id_report','language'),)















